"use client";

import { useEffect, useState } from "react";
import { TransactionReceipt, parseEther } from "viem";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import { hardhat } from "viem/chains";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { getBlockNumber } from 'wagmi/actions'
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { toast } from 'react-hot-toast';
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";
import { Prize } from '~~/components/cosmic-engine/JackpotJunction';
import { useDispatch } from 'react-redux';
import { setStartBlock } from '~~/store/startBlockSlice';
import { useGlobalState } from "~~/services/store/store";
import "~~/styles/roll-button.scss";

type RollButtonProps = {
  isReroll: boolean;
  deployedContractData?: Contract<ContractName>;
  buttonLabel: string;
  isWheelActive: boolean;
  isAccepting: boolean;
  handleIsSpinning: (val: boolean) => void;
  handleLoading: (val: boolean)=> void;
  handlePrizeWon: (prize: Prize | null) => void;
  handleWheelActivity: (val: boolean) => void;
  handleIsTransactionFinished: (val: boolean) => void;
  onChange: () => void;
  triggerRefreshDisplayVariables: () => void;
  rerollCost?: string;
  args?: any;
  payableValue?: string;
  loading: boolean;
  outcome: any,
};

export const RollButton = ({
  isReroll,
  isAccepting,
  deployedContractData,
  buttonLabel,
  handleIsTransactionFinished,
  handleIsSpinning,
  isWheelActive,
  handleWheelActivity,
  handlePrizeWon,
  handleLoading,
  onChange,
  args,
  payableValue,
  rerollCost,
  loading,
  outcome,
  triggerRefreshDisplayVariables
}: RollButtonProps) => {
  const { address: userAddress, chain } = useAccount();
  const writeTxn = useTransactor();
  const { targetNetwork } = useTargetNetwork();
  const writeDisabled = !chain || chain?.id !== targetNetwork.id;
  const { data: result, isPending, writeContractAsync } = useWriteContract();
  const dispatch = useDispatch();
  const [pressed, setPressed] = useState(false);

  const buttonAudio = new Audio('/sounds/button_default.wav');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setPressed(true);
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setPressed(false);
        handleSpin();
      }
    };

    // Add event listener for keydown
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleSpin = async () => {
    buttonAudio.play();
    if (writeContractAsync && deployedContractData && !isAccepting) {
      try {
          let actualCost = isReroll ? rerollCost : payableValue;
          handleIsTransactionFinished(false);
          handlePrizeWon(null);
          handleWheelActivity(true); // start turning wheel
          handleLoading(true);
          const makeWriteWithParams = async() =>
            await writeContractAsync({
              address: deployedContractData.address,
              // @ts-ignore
              functionName: "roll",
              abi: deployedContractData.abi,
              args: args,
              // @ts-ignore
              value: actualCost ? BigInt(actualCost) : BigInt("0"), 
          });
          const res = await writeTxn(makeWriteWithParams);
          const blockNumber = await getBlockNumber(wagmiConfig);
          if (blockNumber !== undefined) {
            dispatch(setStartBlock(blockNumber)); 
          }
        } catch (error) {
          const parsedError = getParsedError(error);
          if (parsedError.includes("Sender doesn't have enough funds"))
          {
            toast.error("Not enough funds, please grab funds from faucet");
          }
          else {
            toast.error(parsedError);
          }
          handleLoading(false);
          handleIsTransactionFinished(true);
          handleWheelActivity(false);
          handlePrizeWon(null);
        }
        // perform another transaction on localhost to make block tick
        try {
          if (chain?.id === hardhat.id) {
            await writeTxn({
              chain: hardhat,
              account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              to: userAddress,
              value: parseEther("0"),
            });        
          }
        } catch (error) {
          toast.error("Problem occured while rolling, please try again.");
          handleLoading(false)
          handleIsTransactionFinished(true);
          handleWheelActivity(false);
        }

        triggerRefreshDisplayVariables();

        onChange();
    }
  };

  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransactionReceipt({
    hash: result,
  });

  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  const spacePressed = useGlobalState(({ spacePressed }) => spacePressed);
  const setSpacePressed = useGlobalState(({ setSpacePressed }) => setSpacePressed);

  useEffect(() => {
    if (spacePressed) {     
      handleSpin(); 
      setSpacePressed(false);
    }
  }, [setSpacePressed, spacePressed]);

  return (
    <div className="py-5 space-y-3 first:pt-0 last:pb-1">
      <div className={`flex gap-3 flex-row justify-between items-center`}>
        <div className="flex justify-between gap-2">
          <div
            className={`flex ${
              writeDisabled &&
              "tooltip before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
            }`}
            data-tip={`${writeDisabled && "Wallet not connected or in the wrong network"}`}
          >
            <button 
              className={`spin ${pressed ? 'pressed' : ''} w-[150px] h-[64px] text-xl text-center`}
              disabled={writeDisabled || isPending || isWheelActive || isAccepting} onClick={handleSpin}
            >
              {isPending || loading || isWheelActive ? <span className="loading loading-spinner loading-xs"></span> : isReroll ? 'Respin' : buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RollButton;
