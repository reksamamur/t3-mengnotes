import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { Fragment, useState } from "react";
import * as Currencies from "@dinero.js/currencies";
import getSymbolFromCurrency from "currency-symbol-map";

import { RadioGroup, Switch, Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import CurrencyInput from "react-currency-input-field";
import { CurrencyInputProps } from "react-currency-input-field";

import Modal from "../../components/Modal";

import { dataCurrencies, CurrenciesType } from "../../utils/currencies";

type SType = {
  type: string | undefined;
};

type SubscribeType = {
  id: string;
  name: string;
};

const plans: SubscribeType[] = [
  {
    id: "recurring",
    name: "Recurring",
  },
  {
    id: "onetime",
    name: "One time",
  },
];

const SubscriptionType = ({ type }: SType) => {
  const [every, setEvery] = useState<number>(0);

  const periods = [
    {
      id: "day",
      name: "Day",
    },
    {
      id: "eeek",
      name: "Week",
    },
    {
      id: "month",
      name: "Month",
    },
    {
      id: "year",
      name: "Year",
    },
  ];

  if (type === "recurring") {
    return (
      <>
        <div className="flex flex-col">
          <div className="md:flex items-center align-bottom md:space-x-4 mt-5">
            <div className="flex-1 space-y-4">
              <label className="block text-base font-semibold text-zinc-900 mb-2">
                Billing period <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center align-bottom space-x-4">
                <label
                  htmlFor="subcsription_period"
                  className="block text-lg font-normal text-zinc-900"
                >
                  Every
                </label>
                <input
                  type="number"
                  id="subcsription_period"
                  name="subcsription_period"
                  autoComplete="off"
                  min={0}
                  onChange={(event) => setEvery(parseInt(event.target.value))}
                  className="border flex-1 w-auto border-zinc-300 outline-none text-zinc-900 text-lg rounded-sm focus:border-zinc-900 p-3"
                  required
                  placeholder="1"
                />
                <select
                  name="subcsription_selectperiod"
                  id="subcsription_selectperiod"
                  required
                  className="border flex-1 w-auto border-zinc-300 outline-none text-zinc-900 text-lg rounded-sm focus:border-zinc-900 p-3"
                >
                  {periods.map((period, index) => (
                    <option key={index} value={period.id}>
                      {every > 1 ? `${period.name}s` : `${period.name}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <label
                htmlFor="subcsription_firstpayment"
                className="block text-base font-semibold text-zinc-900"
              >
                First payment <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                required
                id="subcsription_fpayment"
                name="subcsription_fpayment"
                className="border border-zinc-300 outline-none text-zinc-900 text-lg rounded-sm focus:border-zinc-900 w-full p-3"
              />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="py-6">
          <div className="space-y-4">
            <label
              htmlFor="subcsription_expiredate"
              className="block text-base font-semibold text-zinc-900"
            >
              Expiry date <span className="text-zinc-300">- optional</span>
            </label>
            <input
              type="date"
              id="subcsription_expiredate"
              name="subcsription_expiredate"
              className="border border-zinc-300 outline-none text-zinc-900 text-lg rounded-sm focus:border-zinc-900 w-full p-3"
            />
          </div>
        </div>
      </>
    );
  }
};

const Create: NextPage = () => {
  const submit = trpc.useMutation("subscriptions.create");

  let [isOpenModal, setIsOpenModal] = useState(false);

  const [selected, setSelected] = useState(dataCurrencies[147]);
  const [subscType, setSubscType] = useState(plans[0]);
  const [prefixCurrency, setPrefixCurrency] = useState(
    getSymbolFromCurrency(selected!.code)?.toString()
  );

  /**Hook form */
  const [enabledMember, setEnabledMember] = useState(false);
  
  const [subscriptionPrice, setSubscriptionPrice] = useState<string | number>();

  const [subscriptionObjectPrice, setSubscriptionObjectPrice] = useState({});

  const [queryCurrencies, setQueryCurrencies] = useState("");

  const handleCurrencyChange = (currency: CurrenciesType | undefined) => {
    setSelected(currency);
    const ccode = getSymbolFromCurrency(currency!.code)?.toString();
    setPrefixCurrency(ccode);
    setSubscriptionPrice(subscriptionPrice);
  };

  const filteredCurrencies =
    queryCurrencies === ""
      ? dataCurrencies
      : dataCurrencies.filter((currency, index) =>
          currency.code
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(queryCurrencies.toLowerCase().replace(/\s+/g, ""))
        );

  const handleOnValueChange: CurrencyInputProps["onValueChange"] = (
    value,
    _,
    values
  ): void => {
    setSubscriptionPrice(value);
    setSubscriptionObjectPrice({ value, _, values });
  };

  const handleModalDone = () => {
    setIsOpenModal(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.set("subscription_price", JSON.stringify(subscriptionObjectPrice));
    formData.set("subscription_type", JSON.stringify(subscType?.id));
    formData.set("subcsription_member", JSON.stringify(enabledMember));

    const inputObject = Object.fromEntries(formData);
    try {
      const submitData = await submit.mutateAsync({
        subscription_form: JSON.stringify(inputObject),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container mx-auto md:mx-auto px-4 md:px-10">
        <Modal
          open={isOpenModal}
          cancel={setIsOpenModal}
          ok={handleModalDone}
          btnOkMessage="Leave anyway"
          btnCancelMessage="Stay on this page"
          title="Leave without saving"
          message="Your changes have not been saved. If you leave now, you will lose your changes."
        />

        <form
          autoCapitalize="off"
          onSubmit={(event) => handleSubmit(event)}
          className="space-y-10 mb-10"
        >
          <div>
            <label
              htmlFor="subcsription_currency"
              className="block text-base font-semibold text-zinc-900 mb-2"
            >
              Currency <span className="text-red-600">*</span>
            </label>
            <Combobox
              value={selected}
              onChange={(e) => handleCurrencyChange(e)}
            >
              <div className="relative mt-1">
                <div className="w-full cursor-default overflow-auto rounded-sm bg-white text-left">
                  <Combobox.Input
                    required
                    name="subscription_currency"
                    className="w-full border border-zinc-300 outline-none text-zinc-900 text-lg py-2 pl-3 pr-10leading-5 focus:ring-0"
                    displayValue={() => selected!.code}
                    onChange={(event) => {
                      setQueryCurrencies(event.target.value);
                    }}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <SelectorIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQueryCurrencies("")}
                >
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredCurrencies.length === 0 &&
                    queryCurrencies !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-zinc-700">
                        Nothing found.
                      </div>
                    ) : (
                      filteredCurrencies.map((currency) => (
                        <Combobox.Option
                          key={currency.code}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-zinc-400 text-white"
                                : "text-zinc-900"
                            }`
                          }
                          value={currency}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {currency.code}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? "text-white" : "text-zinc-600"
                                  }`}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>

          <div className="mb-10">
            <label
              htmlFor="subscription_price"
              className="block text-base font-semibold text-zinc-900 mb-2"
            >
              Subscriptions price <span className="text-red-600">*</span>
            </label>
            <CurrencyInput
              prefix={prefixCurrency}
              placeholder="0.00"
              onValueChange={handleOnValueChange}
              value={subscriptionPrice}
              required
              id="subscription_price"
              name="subscription_price"
              className="font-mono text-zinc-900 text-7xl outline-none border-b-2 border-zinc-900 w-full p-3"
            />
          </div>

          <div className="space-y-7">
            <div>
              <label
                htmlFor="subcsription_name"
                className="block text-base font-semibold text-zinc-900 mb-2"
              >
                Subscriptions name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="subcsription_name"
                name="subcsription_name"
                autoComplete="off"
                className="border border-zinc-300 outline-none text-zinc-900 text-lg rounded-sm focus:border-zinc-900 w-full p-3"
                required
                placeholder="e.g. Netflix"
              />
            </div>
            <div>
              <label
                htmlFor="subcsription_description"
                className="block text-base font-semibold text-zinc-900 mb-2"
              >
                Description <span className="text-zinc-300">- optional</span>
              </label>
              <input
                type="text"
                id="subcsription_description"
                name="subcsription_description"
                autoComplete="off"
                className="border border-zinc-300 outline-none text-zinc-900 text-lg rounded-sm focus:border-zinc-900 w-full p-3"
                placeholder="e.g. Premium Plan"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="subscription_type"
              className="block text-base font-normal text-zinc-90 mb-1"
            >
              Subscriptions type <span className="text-red-600">*</span>
            </label>
            <RadioGroup value={subscType} onChange={setSubscType}>
              <div className="flex space-x-9 border-b-2 border-zinc-200">
                {plans.map((plan) => (
                  <RadioGroup.Option
                    key={plan.name}
                    value={plan}
                    className={({ active, checked }) =>
                      `${active ? "" : ""}
                        ${
                          checked
                            ? "border-b-2 border-zinc-900 text-zinc-900"
                            : "hover:text-zinc-900"
                        }
                          cursor-pointer rounded-sm text-zinc-900 py-4 focus:outline-none`
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-lg">
                              <RadioGroup.Label
                                as="p"
                                className={`font-semibold ${
                                  checked
                                    ? "text-zinc-900"
                                    : "text-zinc-300 hover:text-zinc-900"
                                }`}
                              >
                                {plan.name}
                              </RadioGroup.Label>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
            <SubscriptionType type={subscType?.id} />
          </div>

          <div className="space-y-3">
            <label
              htmlFor="subcsription_paymentmethod"
              className="block text-base font-semibold text-zinc-900 mb-1"
            >
              Payment method <span className="text-zinc-300">- optional</span>
            </label>
            <input
              type="text"
              id="subcsription_paymentmethod"
              name="subcsription_paymentmethod"
              autoComplete="off"
              className="border border-zinc-300 outline-none text-zinc-900 text-lg rounded-sm focus:border-zinc-900 w-full p-3"
              placeholder="e.g. Visa"
            />
          </div>

          <div className="flex items-center align-middle space-x-4 border border-zinc-300 p-4">
            <Switch
              checked={enabledMember}
              onChange={setEnabledMember}
              name="subcsription_member"
              className={`${enabledMember ? "bg-zinc-900" : "bg-zinc-300"}
              relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span className="sr-only"></span>
              <span
                aria-hidden="true"
                className={`${enabledMember ? "translate-x-9" : "translate-x-0"}
                pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
            <h4>Do you have any member?</h4>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setIsOpenModal(true)}
              className="cursor-pointer py-4 px-8 border border-zinc-900 outline-none text-zinc-900 hover:bg-zinc-300 text-lg rounded-sm"
            >
              Cancel
            </button>
            <input
              type="submit"
              value="Submit"
              className="cursor-pointer py-4 px-8 bg-zinc-900 outline-none text-white hover:bg-zinc-500 text-lg rounded-sm"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Create;
