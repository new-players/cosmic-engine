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
export const JackpotBalance = ({ address, className = "", usdMode, rawMode }: BalanceProps) => {
  const { targetNetwork } = useTargetNetwork();
  const price = useGlobalState(state => state.nativeCurrencyPrice);
  const {
    data: balance,
    isError,
    isLoading,
  } = useWatchBalance({
    address,
  });
  const formattedBalance = balance ? Number(formatEther(balance.value))/2 : 0;

  const [displayUsdMode, setDisplayUsdMode] = useState(price > 0 ? Boolean(usdMode) : false);

  const toggleBalanceMode = () => {
    if (price > 0) {
      setDisplayUsdMode(prevMode => !prevMode);
    }
  };

  if(rawMode){
    return (
      <>
        {displayUsdMode ? 
        `$${(formattedBalance * price).toFixed(2)}`
        :
        `${(formattedBalance * price).toFixed(2)} ${targetNetwork.nativeCurrency.symbol}`
        }
      </>
    )
  }


  if (!address || isLoading || balance === null) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
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
      className={`btn btn-sm btn-ghost flex flex-col font-normal items-center hover:bg-transparent ${className}`}
      onClick={toggleBalanceMode}
    >
      <div className="w-full flex items-center justify-center">
        {displayUsdMode ? (
          <>
            <span className="text-[1.5] font-bold mr-1">$</span>
            <span className="text-[1.5em] font-bold ml-1">{(formattedBalance * price).toFixed(2)}</span>
          </>
        ) : (
          <>
            <span className="text-[1.5em] font-bold ml-1 px-2">{formattedBalance.toFixed(2)}</span>
            <span className="text-[1.5em] font-bold ml-1">{targetNetwork.nativeCurrency.symbol}</span>
          </>
        )}
      </div>
    </button>
  );
};
