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
  const formattedBalance = balance ? (Number(formatGwei(balance.value))/64).toLocaleString() : 0;

  const [displayUsdMode, setDisplayUsdMode] = useState(price > 0 ? Boolean(usdMode) : false);

  const toggleBalanceMode = () => {
    if (price > 0) {
      setDisplayUsdMode(prevMode => !prevMode);
    }
  };

  // if(rawMode){
  //   return (
  //     <>
  //       { displayUsdMode ? 
  //         `$${(formattedBalance * price).toFixed(2)}`
  //       :
  //         `${targetNetwork.nativeCurrency.symbol}`
  //       }
  //     </>
  //   )
  // }

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
      className={`relative group z-[10] w-full px-0 btn btn-sm btn-ghost flex flex-col font-ibmPlexMono font-normal hover:bg-transparent ${className}`}
      onClick={toggleBalanceMode}
    >
      <div className="w-full flex text-white">
        {displayUsdMode ? (
          <>
            <span className="text-[10px] xs:text-[.9rem] lg:text-base 4xl:text-5xl px-2 text-white">$</span>
            <span>
              {`${formattedBalance} GWEI`}
            </span>
          </>
        ) : (
          <div className="flex flex-wrap w-full justify-end lg:pt-[15px] overflow-hidden">
            <div className="text-[10px] xs:text-[.9rem] lg:text-xl 4xl:text-5xl text-white text-right truncate leading-normal">
              {formattedBalance}<br/>
              GWEI
            </div>
          </div>
        )}
      </div>
      <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 opacity-0 px-3 py-1 text-sm text-white bg-gray-700 rounded-xl group-hover:opacity-100 transition-opacity duration-300">
        {`${formattedBalance} GWEI`}
        {/* arrow pointing downward */}
        <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-[5px] border-t-gray-700 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent"></div>
      </div>
    </button>
  );
};
