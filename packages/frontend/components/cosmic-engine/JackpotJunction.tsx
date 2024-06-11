'use client';

import "@farcaster/auth-kit/styles.css";
import { useState, useCallback } from 'react';
import { SignInButton, StatusAPIResponse } from "@farcaster/auth-kit";
import { usePrivy } from "@privy-io/react-auth";
import { signIn, signOut, getCsrfToken } from "next-auth/react";
import { GameAccountDisplay } from "~~/components/cosmic-engine";
import { UniversalButton } from "~~/components/cosmic-engine/UniversalButton";
import { WriteOnlyFunctionForm } from "~~/app/debug/_components/contract";
import { Contract, ContractName, GenericContract, InheritedFunctions } from "~~/utils/scaffold-eth/contract";

import { 
    JJ_CONTRACT_NAME, 
    ROLL_COST,
    UniversalButtonParams 
    } from "@/lib/constants";

import deployedContracts from "@/contracts/deployedContracts";
import { Abi, AbiFunction } from "abitype";

import { RollButton } from "~~/components/cosmic-engine";

import { JackpotWheel } from "~~/components/cosmic-engine/JackpotWheel";
import { Profile } from "~~/components/cosmic-engine/Profile";

import { useLocalStoragePreferences } from "@/hooks/cosmic-engine";

const deployedContractData = deployedContracts[31337].JackpotJunction;


export const JackpotJunction = () => {
    const [error, setError] = useState(false);
    const { ready, authenticated, user, login, logout } = usePrivy();
    const { isOnchain } = useLocalStoragePreferences();

    const getNonce = useCallback(async () => {
        const nonce = await getCsrfToken();
        if (!nonce) throw new Error("Unable to generate nonce");
        return nonce;
    }, []);

    const handleSuccess = useCallback(
        (res: StatusAPIResponse) => {
            signIn("credentials", {
                message: res.message,
                signature: res.signature,
                name: res.username,
                pfp: res.pfpUrl,
                redirect: false,
            });
    }, []);

    const functionsToDisplay = (
        (deployedContractData.abi as Abi).filter(part => part.type === "function") as AbiFunction[]
      )
        .filter(fn => {
          const isWriteableFunction = fn.stateMutability !== "view" && fn.stateMutability !== "pure";
          return isWriteableFunction;
        })
        .filter(fn => fn.name == "roll")
        .map(fn => {
          return {
            fn,
            inheritedFrom: ((deployedContractData as GenericContract)?.inheritedFunctions as InheritedFunctions)?.[fn.name],
          };
        })
    
      if (!functionsToDisplay.length) {
        return <>No write methods</>;
      }

    return (
        <div className="flex flex-col grow">
            <div style={{ position: "fixed", top: "80px", right: "12px" }}>
                <SignInButton
                    nonce={getNonce}
                    onSuccess={handleSuccess}
                    onError={() => setError(true)}
                    onSignOut={() => signOut()}
                />
                {error && <div>Unable to sign in at this time.</div>}
            </div>
            <div style={{ position: "fixed", top: "140px", right: "12px" }}>
                {
                ready && authenticated ? 
                    <button
                        onClick={logout}
                        className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
                    >
                        Logout
                    </button>     
                :
                <button
                    className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg"
                    onClick={login}
                >
                    Privy Login
                </button>                    
                }
            </div>   
            <div className="flex flex-col justify-center items-center grow text-center">
                <GameAccountDisplay />
                {/* TODO: Add array for prize pool to make wheel dynamic  */}
                <JackpotWheel/>
                <div className="flex justify-center">

                {
                    (isOnchain) ? 
                    functionsToDisplay.map(({ fn, inheritedFrom }, idx) => (                    
                <WriteOnlyFunctionForm
                abi={deployedContractData.abi as Abi}
                key={`${fn.name}-${idx}}`}
                abiFunction={fn}
                onChange={() => {}}
                contractAddress={deployedContractData.address}
                inheritedFrom={inheritedFrom}
                />
              ))
              : <RollButton/>
            }                    
                  
                </div>
                <Profile />
            </div>
        </div>
    );
};