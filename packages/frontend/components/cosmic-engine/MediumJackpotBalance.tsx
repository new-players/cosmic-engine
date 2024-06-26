"use client";

import { useState } from "react";
import { Address, formatEther } from "viem";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import { useGlobalState } from "~~/services/store/store";

type BalanceProps = {
  address?: Address;
  className?: string;
  usdMode?: boolean;
  rawMode?: boolean;
};

/**
 * Display (ETH & USD) balance of an ETH address.
 */
export const MediumJackpotBalance = ({ address, className = "", usdMode, rawMode }: BalanceProps) => {
  const { targetNetwork } = useTargetNetwork();
  const price = useGlobalState(state => state.nativeCurrencyPrice);
  const {
    data: balance,
    isError,
    isLoading,
  } = useWatchBalance({
    address,
  });
  const formattedBalance = balance ? Number(formatEther(balance.value))/64 : 0;

  const [displayUsdMode, setDisplayUsdMode] = useState(price > 0 ? Boolean(usdMode) : false);

  const toggleBalanceMode = () => {
    if (price > 0) {
      setDisplayUsdMode(prevMode => !prevMode);
    }
  };

  if(rawMode){
    return (
      <>
        { displayUsdMode ? 
          `$${(formattedBalance * price).toFixed(2)}`
        :
          `${targetNetwork.nativeCurrency.symbol}`
        }
      </>
    )
  }

  if (!address || isLoading || balance === null) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}>
        <div className="text-warning">Error</div>
      </div>
    );
  }


  return (
    <button
      className={`btn btn-sm btn-ghost flex flex-col font-ibmPlexMono font-normal items-center hover:bg-transparent ${className}`}
      onClick={toggleBalanceMode}
    >
      <div className="w-full flex items-center justify-center text-white">
        {displayUsdMode ? (
          <>
            <span className="text-[10px] xs:text-[.9rem] lg:text-base 4xl:text-5xl px-2 text-white">$</span>
            <span>{(formattedBalance * price).toFixed(2)}</span>
          </>
        ) : (
          <div className="flex flex-wrap overflow-hidden w-full justify-center">
            <div className="text-[10px] xs:text-[.9rem] lg:text-base 4xl:text-5xl px-2 text-white">
              {`${formattedBalance.toFixed(4)} ${targetNetwork.nativeCurrency.symbol}`}
            </div>
          </div>
        )}
      </div>
    </button>
  );
};
