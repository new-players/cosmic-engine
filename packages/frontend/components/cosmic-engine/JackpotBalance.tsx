"use client";

import { useState } from "react";
import { Address, formatEther, formatGwei } from "viem";
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
  const formattedBalance = balance ? (Number(formatGwei(balance.value))/2).toLocaleString() : 0;

  const [displayUsdMode, setDisplayUsdMode] = useState(price > 0 ? Boolean(usdMode) : false);

  const toggleBalanceMode = () => {
    if (price > 0) {
      setDisplayUsdMode(prevMode => !prevMode);
    }
  };

  // if(rawMode){
  //   return (
  //     <>
  //       {displayUsdMode ? 
  //       `$${(formattedBalance * price).toFixed(2)}`
  //       :
  //       `${(formattedBalance * price).toFixed(2)} ${targetNetwork.nativeCurrency.symbol}`
  //       }
  //     </>
  //   )
  // }


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
    <div className="relative w-full h-full group">
      <div className="w-full h-full truncate">
        <button
          className={`w-full btn btn-sm btn-ghost flex flex-col font-normal justify-start hover:bg-transparent ${className} `}
          onClick={toggleBalanceMode}
        >
          <div className="w-full h-full flex justify-start">
            {displayUsdMode ? (
              <div className="flex w-full justify-center">
                <div className="font-bold text-[#EB28E3]black text-sm xs:text-xl lg:text-3xl 4xl:text-6xl truncate">
                {`${formattedBalance} GWEI`}
                </div>
              </div>
            ) : (
              <div className="flex w-full h-full justify-center overflow-hidden">
                <div className="font-bold text-[#EB28E3] text-sm xs:text-xl lg:text-3xl 4xl:text-6xl truncate">
                  {`${formattedBalance} GWEI`}
                </div>
              </div>
            )}
          </div>
        </button>
        <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 opacity-0 px-3 py-1 text-sm text-white bg-gray-700 rounded-xl group-hover:opacity-100 transition-opacity duration-300">
          {`${formattedBalance} GWEI`}
          {/* arrow pointing downward */}
          <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-[5px] border-t-gray-700 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent"></div>
        </div>
      </div>
    </div>
  );
};
