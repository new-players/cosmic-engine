import { create } from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type GlobalState = {
  nativeCurrencyPrice: number;
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
  userCurrency: number;
  setUserCurrency: (newUserCurrencyState: number) => void;
  itemImages: Buffer[];
  setItemImages: (newItemImages: Buffer[]) => void;
  cosmicConsole: boolean;
  setCosmicConsole: (newCosmicConsoleState: boolean) => void;
};

export const useGlobalState = create<GlobalState>(set => ({
  nativeCurrencyPrice: 0,
  setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
  userCurrency: 0,
  setUserCurrency: (newValue: number): void => set(() => ({ userCurrency: newValue })),
  itemImages: [],
  setItemImages: (newItemImages: Buffer[]) => set(() => ({ itemImages: newItemImages})),
  cosmicConsole: true,
  setCosmicConsole: (newCosmicConsoleState: boolean) => set(() => ({ cosmicConsole: newCosmicConsoleState})),
}));
