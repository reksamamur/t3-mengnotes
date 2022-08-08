import * as Currencies from "@dinero.js/currencies";
import getSymbolFromCurrency from "currency-symbol-map";

export type CurrenciesType = {
  symbol: string;
  code: string;
  base: string;
  exponent: string;
}

const dataCurrencies: CurrenciesType[] = [];
Object.keys(Currencies).map(function (key, index) {
  const mcurrency: CurrenciesType = {
    symbol: getSymbolFromCurrency(Currencies[key].code)!,
    code: Currencies[key].code,
    base: Currencies[key].base,
    exponent: Currencies[key].exponent,
  };
  dataCurrencies.push(mcurrency);
});

export { dataCurrencies };
