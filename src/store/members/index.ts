import create from "zustand";
import { Member, DataPrice } from "../types";
import { formatValue } from "react-currency-input-field";
import getSymbolFromCurrency from "currency-symbol-map";

interface MembersStore {
  members: Member[];
  awalPrice: string;
  globalPrice?: string;
  name: string;
  email: string;
  globalCurrency: string;
  checkManual: boolean;
  exceedInitialPrice: Boolean;
  setExceedInitialPrice: () => void;
  setGlobalCurrency: (currency: string) => void;
  setGlobalPrice: (price: string) => void;
  setAwalPrice: (price: string) => void;
  addMember: (
    name: string,
    email: string,
    currency: string,
    price_float: number,
    price_formatted: string
  ) => void;
  setEmail: (email: string, index: number) => void;
  setCheckedMember: (index: number, check: boolean) => void;
  setName: (name: string, index: number) => void;
  updateMember: () => void;
  removeMember: (index: number) => void;
  handlePriceChangeMember: (
    index: number,
    price_value: string,
    price_float: number,
    price_formatted: string
  ) => void;
}

const initialState = {
  members: [] as Member[],
};

const formattedPrice = (price: string, currency?: string): string => {
  let endedPrice = "";
  if (currency) {
    endedPrice = formatValue({
      value: price,
      groupSeparator: ",",
      decimalSeparator: ".",
      prefix: getSymbolFromCurrency(currency)?.toString()!,
    });
  } else {
    endedPrice = formatValue({
      value: price,
      groupSeparator: ",",
      decimalSeparator: ".",
    });
  }

  return endedPrice;
};

const updateMembers = (
  member: Member[],
  price_global: string | undefined,
  currency: string
): Member[] => {
  const updatedMember = member.map((obj) => {
    if (obj.manual_edit === false) {
      return obj;
    }
    return {
      ...obj,
      price: {
        ...obj.price,
        float: parseFloat(price_global!),
        formatted: formattedPrice(price_global!, currency),
        value: price_global,
      },
    };
  });

  return updatedMember;
};

const memberPriceChange = (
  index: number,
  members: Member[],
  price_value: string,
  price_float: number,
  price_formatted: string
): Member[] => {
  const memberPrice = members.map((obj) => {
    if (obj.index === index) {
      return {
        ...obj,
        price: {
          ...obj.price,
          value: price_value,
          float: price_float,
          formatted: price_formatted
        },
      };
    }
    return obj;
  });
  return memberPrice;
};

const addMember = (
  members: Member[],
  name: string,
  email: string,
  currency: string,
  price_float: number,
  price_formatted: string,
  price_value: string | undefined
): Member[] => [
  ...members,
  {
    index: members.length === 0 ? members.length : members.at(-1)?.index! + 1,
    name: name,
    email: email,
    manual_edit: true,
    currency: currency,
    price: {
      currency: currency,
      float: price_float,
      formatted: formattedPrice(price_formatted!, currency),
      value: price_value,
    },
  },
];

const assignNewPrice = (
  awalPrice: string,
  members: Member[],
  currency?: string
): string => {
  const newPrice = (parseFloat(awalPrice) / members.length).toFixed(2);

  let formattedPrice = "";

  if (currency) {
    formattedPrice = formatValue({
      value: newPrice,
      groupSeparator: ",",
      decimalSeparator: ".",
      prefix: getSymbolFromCurrency(currency)?.toString()!,
    });
  } else {
    formattedPrice = formatValue({
      value: newPrice,
      groupSeparator: ",",
      decimalSeparator: ".",
    });
  }

  return formattedPrice;
};

const removeMember = (
  members: Member[],
  index: number,
  awalPrice: string | undefined
): Member[] => {
  const price = assignNewPrice(awalPrice!, members);

  return members
    .filter((member) => member.index !== index)
    .map((obj) => {
      if (obj.manual_edit === false) {
        return obj;
      }
      return {
        ...obj,
        price: {
          ...obj.price,
          value: price,
        },
      };
    });
};

const setGlobalPrice = (
  globalPrice: string | undefined,
  price: string
): string => {
  return (globalPrice = price);
};

const setCheckManual = (
  member: Member[],
  index: number,
  check: boolean,
  price: string,
  currency: string
): Member[] => {
  const updateCheckedMember = member.map((obj) => {
    if (obj.index === index) {
      if (check === true) {
        return {
          ...obj,
          manual_edit: check,
          price: {
            ...obj.price,
            float: parseFloat(price!),
            formatted: formattedPrice(price!, currency),
            value: price,
          },
        };
      } else {
        return {
          ...obj,
          manual_edit: check,
        };
      }
    }
    return obj;
  });

  return updateCheckedMember;
};

const updateNameMember = (
  member: Member[],
  index: number,
  name: string
): Member[] => {
  const updateCheckedMember = member.map((obj) => {
    if (obj.index === index) {
      return {
        ...obj,
        name: name,
      };
    }
    return obj;
  });

  return updateCheckedMember;
};

const updateEmailMember = (
  member: Member[],
  index: number,
  email: string
): Member[] => {
  const updateCheckedMember = member.map((obj) => {
    if (obj.index === index) {
      return {
        ...obj,
        email: email,
      };
    }
    return obj;
  });

  return updateCheckedMember;
};

const checkTotalPrice = (awalPrice: string, globalPrice: string, member: Member[]): boolean => {
  let memberPrice = new Array();

  const parseGlobalPrice = parseFloat(globalPrice);

  member.forEach((obj) => {
    memberPrice.push(obj.price.float!);
  });

  const membersTotalPriceRound = Math.round(
    memberPrice.reduce((pv, cv) => pv + cv, 0) + parseGlobalPrice
  );
  const initialPriceRound = Math.round(parseFloat(awalPrice));

  console.log([
    membersTotalPriceRound,
    initialPriceRound,
    member,
    memberPrice,
    parseGlobalPrice,
  ]);

  if (membersTotalPriceRound === initialPriceRound) {
    return true;
  }

  return false;
}

const useStore = create<MembersStore>((set, get) => ({
  ...initialState,
  awalPrice: "",
  name: "",
  email: "",
  globalPrice: "",
  globalCurrency: "",
  checkManual: true,
  exceedInitialPrice: true,
  setExceedInitialPrice: () =>
    set((state) => ({
      ...state,
      exceedInitialPrice: checkTotalPrice(
        state.awalPrice,
        state.globalPrice!,
        state.members
      ),
    })),
  setEmail: (email, index) =>
    set((state) => ({
      ...state,
      members: updateEmailMember(state.members, index, email),
    })),
  setName: (name, index) =>
    set((state) => ({
      ...state,
      members: updateNameMember(state.members, index, name),
    })),
  setCheckedMember: (index, check) =>
    set((state) => ({
      ...state,
      members: setCheckManual(
        state.members,
        index,
        check,
        state.globalPrice!,
        state.globalCurrency
      ),
    })),
  setGlobalCurrency: (currency) =>
    set(() => ({
      globalCurrency: currency,
    })),
  setAwalPrice: (price) =>
    set(() => ({
      awalPrice: price,
    })),
  setGlobalPrice: (price) =>
    set((state) => ({
      globalPrice: setGlobalPrice(state.globalPrice, price),
    })),
  addMember: (name, email, currency, price_float, price_formatted) =>
    set((state) => ({
      ...state,
      members: addMember(
        state.members,
        name,
        email,
        currency,
        price_float,
        price_formatted,
        get().globalPrice
      ),
    })),
  removeMember: (index) =>
    set((state) => ({
      ...state,
      members: removeMember(state.members, index, state.awalPrice),
      globalPrice: assignNewPrice(state.awalPrice, state.members),
    })),
  updateMember: () =>
    set((state) => ({
      ...state,
      members: updateMembers(
        state.members,
        get().globalPrice,
        state.globalCurrency
      ),
    })),
  handlePriceChangeMember: (index, price_value, price_float, price_formatted) =>
    set((state) => ({
      ...state,
      members: memberPriceChange(
        index,
        state.members,
        price_value,
        price_float,
        price_formatted
      ),
    })),
}));

export default useStore;
