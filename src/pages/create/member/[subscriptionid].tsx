import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import CurrencyInput from "react-currency-input-field";
import { formatValue } from "react-currency-input-field";
import Modal from "../../../components/Modal";
import getSymbolFromCurrency from "currency-symbol-map";
import useStore from "../../../store/members";

const Member: NextPage = () => {
  const router = useRouter();
  const { subscriptionid } = router.query;

  const {
    name,
    email,
    members,
    exceedInitialPrice,
    globalPrice,
    addMember,
    updateMember,
    setAwalPrice,
    removeMember,
    setGlobalPrice,
    setGlobalCurrency,
    setCheckedMember,
    setName,
    setEmail,
    handlePriceChangeMember,
    setExceedInitialPrice
  } = useStore();

  const checkData = trpc.useQuery([
    "subscriptions.check",
    {
      subscription_id: String(subscriptionid),
    },
  ]);

  const [isOpenModal, setIsOpenModal] = useState(false);

  if (checkData.isLoading) return <>Loading</>;

  if (checkData.data?.status === 404) return <>Not found</>;

  const handleModalDone = () => {
    setIsOpenModal(false);
  };

  const handleAddIInputMember = () => {
    const nEachPrice = (
      checkData.data?.data?.float! /
      (2 + members.length)
    ).toFixed(2);

    const formattedPrice = formatValue({
      value: nEachPrice.toString(),
      groupSeparator: ",",
      decimalSeparator: ".",
    });

    setGlobalPrice(formattedPrice);
    setGlobalCurrency(checkData.data?.data?.currency!);
    setAwalPrice(checkData.data?.data?.float!.toString()!);

    addMember(
      name,
      email,
      checkData.data?.data?.currency!,
      parseFloat(formattedPrice),
      formattedPrice
    );
    updateMember();
    setExceedInitialPrice();
  };

  const handleRemoveMember = (index: number) => {
    removeMember(index);
    updateMember();
    setExceedInitialPrice();
  };

  const handleOnValueChange = (
    value: any,
    name: any,
    values: any,
    index: any
  ): void => {
    handlePriceChangeMember(index, value, values.float, values.formatted);
    setExceedInitialPrice();
  };

  const handleCheckManual = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, checked } = e.target;
    setCheckedMember(index, checked);
    setExceedInitialPrice();
  };

  const handleChangeName = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setName(value, index);
  };

  const handleChangeEmail = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setEmail(value, index);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setExceedInitialPrice();
    console.log(members);
    console.log(exceedInitialPrice)
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
        <h6>Total subscription payment</h6>
        <div className="font-mono text-7xl">
          {checkData.data?.data?.formatted}
        </div>
        <div>
          {exceedInitialPrice === false ? "Loh lewat batas dan kurang" : ""}
        </div>
        <button
          onClick={() => handleAddIInputMember()}
          type="button"
          className="px-3 py-2 text-zinc-900 bg-zinc-200 focus:outline-none hover:bg-zinc-400 font-medium rounded-sm"
        >
          Add Member | {globalPrice}
        </button>
        <div>
          <form
            autoCapitalize="off"
            onSubmit={(event) => handleSubmit(event)}
            className="space-y-10 mb-10"
          >
            {members.map((member, index) => (
              <div key={member.index} className=" mt-3">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <div className="px-3 py-2 text-zinc-900 font-medium text-xl">
                      <span className="font-mono">{member.index + 1}</span> #{" "}
                      <span className="font-mono"> {member.name}</span>
                    </div>
                    <div className="px-3 text-zinc-900 font-mono text-sm">
                      {member.email}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleRemoveMember(member.index)}
                      className="px-3 py-2 text-zinc-900 bg-red-200 focus:outline-none hover:bg-red-400 font-medium rounded-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="p-2 flex flex-row justify-between items-center">
                  <div className="flex flex-col space-y-5">
                    <input
                      required
                      type="text"
                      name={`name_member_${member.index}`}
                      onChange={(e) => handleChangeName(e, member.index)}
                      placeholder="name"
                      className="border border-zinc-300 outline-none text-zinc-900 text-lg rounded-sm focus:border-zinc-900 w-full p-3"
                    />
                    <input
                      required
                      type="email"
                      name={`email_member_${member.index}`}
                      onChange={(e) => handleChangeEmail(e, member.index)}
                      placeholder="email"
                      className="border border-zinc-300 outline-none text-zinc-900 text-lg rounded-sm focus:border-zinc-900 w-full p-3"
                    />
                  </div>
                  <div className="space-y-5">
                    <CurrencyInput
                      prefix={getSymbolFromCurrency(
                        member.currency!
                      )?.toString()}
                      placeholder="0.00"
                      onValueChange={(value, name, values) =>
                        handleOnValueChange(value, name, values, member.index)
                      }
                      value={member.price.value}
                      required
                      disabled={member.manual_edit}
                      id="subscription_price"
                      name={`subscription_price_${member.index}`}
                      className="font-mono text-zinc-900 text-2xl outline-none border-b-2 border-zinc-900 w-full p-3"
                    />
                    <div className="flex items-center pl-4 rounded border border-gray-200">
                      <input
                        id={`manual_${member.index}`}
                        type="checkbox"
                        value=""
                        name={`manual_${member.index}`}
                        checked={member.manual_edit}
                        onChange={(e) => handleCheckManual(e, member.index)}
                        className="w-4 h-4 text-zinc-600 rounded-full border-gray-300 cursor-auto"
                      />
                      <label
                        htmlFor={`manual_${member.index}`}
                        className="py-4 ml-2 w-full text-sm font-medium text-zinc-900"
                      >
                        Manual Edit ?
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="mt-2" />
              </div>
            ))}

            <input
              type="submit"
              value="Submit"
              disabled={exceedInitialPrice === true ? false : true}
              className="cursor-pointer py-4 px-8 bg-zinc-900 outline-none text-white hover:bg-zinc-500 text-lg rounded-sm disabled:cursor-not-allowed disabled:hover:bg-zinc-500 disabled:bg-zinc-500"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Member;
