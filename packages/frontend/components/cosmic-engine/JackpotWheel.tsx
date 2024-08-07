'use client';

import React, { useEffect, useState, useRef } from "react";
import { TransactionReceipt } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { Contract, ContractName } from "~~/utils/scaffold-eth/contract";
import { useSpring, useSpringRef, animated, config, easings } from '@react-spring/web';
import { Prize } from './JackpotJunction';
import { confetti } from "@tsparticles/confetti";
import Image from 'next/image';
import "~~/styles/roll-button.scss";
import ItemImage from "./ItemImage";
import DegenCard from "./DegenCard";
import Lottie from 'react-lottie';
import Loader from '~~/components/cosmic-engine/AcceptLoader';
import { JackpotBalance } from "./JackpotBalance";
import { MediumJackpotBalance } from "./MediumJackpotBalance";
import { formatGwei } from "viem";
import PrizeRing from "./PrizeRing";

interface JackpotWheelProps {
    wheelState: string,
    prizeSmall?: bigint,
    prizeWon?: Prize | null;
    isReroll: boolean;
    handleReroll: (val: boolean) => void;
    handleLoading: (val:boolean) => void;
    handleWheelState: (val: string) => void;
    handlePrizeWon: (prize:Prize | null) => void;
    handleIsTransactionFinished: (val: boolean) => void;
    handleIsAcceptingPrize: (val:boolean) => void ;
    deployedContractData: Contract<ContractName> | null;
    isWheelActive: boolean;
    handleWheelActivity: (val: boolean) => void;
}  

export const JackpotWheel = (props:JackpotWheelProps) => {
    const {
        isWheelActive,
        wheelState,
        handleIsTransactionFinished,
        prizeWon, 
        prizeSmall,
        isReroll,
        handleWheelActivity,
        handleIsAcceptingPrize,
        handleWheelState,
        handlePrizeWon,
        handleReroll,
        handleLoading, 
        deployedContractData, 
    } = props;
    const prizes = [
        { color: '#242424', type: 0 },
        { color: '#7a4f9b', type: 1 },
        { color: '#242424', type: 2 },
        { color: '#7a4f9b', type: 3 },
        { color: '#242424', type: 4 },
        { color: '#7a4f9b', type: 0 },
        { color: '#242424', type: 1 },
        { color: '#7a4f9b', type: 2 },
        { color: '#242424', type: 3 },
        { color: '#7a4f9b', type: 4 },
    ];
    const wheelRef = useSpringRef();
    const slices = prizes.length;
    const angle = 360 / slices;
    const [ initialLoop, setInitialLoop ] = useState(true);
    const [ isWheelResting, setIsWheelResting ] = useState(true);
    const [ finishedAccelerating, setFinishedAccelerating ] = useState(false);
    const [ prizeAngle, setPrizeAngle ] = useState(0);
    const [ isPrizeVisible, setIsPrizeVisible ] = useState(false);
    const [ isLightActive, setIsLightActive ] = useState(false);
    // contract
    const { chain } = useAccount();
    const writeTxn = useTransactor();
    const { targetNetwork } = useTargetNetwork();
    const writeDisabled = !chain || chain?.id !== targetNetwork.id;

    const { data: result, isPending, writeContractAsync } = useWriteContract();
    const [currentScreenSize, setCurrentScreenSize] = useState<number | null>(null);

    // Sounds
    const outcome_bust = useRef<HTMLAudioElement | undefined>(
        typeof Audio !== "undefined" ? new Audio('/sounds/error.wav')
        : undefined
    )

    const spinningSound = useRef<HTMLAudioElement | undefined>(
      typeof Audio !== "undefined" ? new Audio("/sounds/wheel_spinning.wav") 
      : undefined
    );

    const timeoutSound = useRef<HTMLAudioElement | undefined>(
        typeof Audio !== "undefined" ? new Audio("/sounds/outcome_timeout.wav") 
        : undefined
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const updateScreenSize = () => {
                setCurrentScreenSize(window.innerWidth);
            };
            updateScreenSize();

            window.addEventListener('resize', updateScreenSize);
            return () => window.removeEventListener('resize', updateScreenSize);
        }
    }, []);
    
    const getScreenBreakpoint = () => {
        if (currentScreenSize === null) return 'none';
        const width = currentScreenSize;
        if( width >= 475  && width < 1024){
            return 'xs';
        } else if ( width >= 1024 && width < 2560) { //3xl: width >= 1800 && width < 2560
            return 'lg';
        } else if ( width >= 2560) {
            return '4xl';
        } else {
            return 'def'; //default
        }
    }


    const closePrizeVisibility = () => {
        setIsPrizeVisible(false);
    }

    const handleAccept = () => {
        handleIsAcceptingPrize(true);
    }

    useEffect(() => {
        setPrizeAngle(getAngle())
    }, [prizeWon]);    

    const handleWrite = async () => {
        if (writeContractAsync && deployedContractData) {
        try {
            const makeWriteWithParams = () =>
            writeContractAsync({
                address: deployedContractData.address,
                // @ts-ignore
                functionName: "accept",
                abi: deployedContractData.abi,
                // @ts-ignore
                value: BigInt("0"), 
            });
            const res = await writeTxn(makeWriteWithParams);
            handlePrizeWon(null);
            setIsPrizeVisible(false)
        } catch (e: any) {
            console.error("⚡️ ~ file: WriteOnlyFunctionForm.tsx:handleWrite ~ error", e);
            handlePrizeWon(null);
        }
        }
    };

    const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
    const { data: txResult } = useWaitForTransactionReceipt({
        hash: result,
    });
    

    useEffect(() => {
        setDisplayedTxResult(txResult);
    }, [txResult]);

    useEffect(() => {
        if(wheelState === "accelerating"){
            setIsLightActive(true);
        }
    }, [wheelState]);

    let fadeInterval : NodeJS.Timeout | null = null;
    const initiateWheelSound = () => {
        if(typeof spinningSound != "undefined" && spinningSound.current && typeof spinningSound.current.volume === 'number'  && typeof spinningSound.current.currentTime === 'number'){
            spinningSound.current.volume = 1;
            spinningSound.current.currentTime = 0;
            spinningSound.current.loop = true;
            spinningSound?.current?.play();
        }
    }
    // Function to fade out the sound
    const fadeOutSound = () => {
        if(typeof spinningSound != "undefined" && spinningSound.current && typeof spinningSound.current.volume === 'number'){
            const fadeDuration = 1500; // Duration of the fade-out in milliseconds
            const fadeSteps = 20; // Number of steps for the fade-out
            const initialVolume = spinningSound?.current?.volume;
            const fadeStepInterval = fadeDuration / fadeSteps;
        
            fadeInterval = setInterval(() => {
                const currentVolume = spinningSound.current?.volume;
                if (typeof currentVolume === 'number' && spinningSound?.current?.volume !== undefined && typeof spinningSound.current.currentTime === 'number') {
                    const targetVolume = spinningSound?.current?.volume - (initialVolume / fadeSteps);
                    if (targetVolume > 0) {
                        spinningSound.current.volume = targetVolume;
                    } else {
                        spinningSound.current.pause();
                        spinningSound.current.volume = 1; 
                        spinningSound.current.currentTime = 0;
                        clearInterval((fadeInterval !== null) ? fadeInterval : undefined);
                        spinningSound.current.volume = initialVolume; // Reset volume to initial after fade-out
                    }
                }
            }, fadeStepInterval) as unknown as NodeJS.Timeout;
        }
    };

    const finishingRoll = async () => {
        handleWheelState('decelerating');
        setInitialLoop(true);
        setFinishedAccelerating(false);
        handleWheelActivity(false);
        fadeOutSound();
        if(prizeWon && prizeWon.prizeType !== '0'){
            setIsPrizeVisible(true);
        }
        handleLoading(false);
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                handleWheelState('notMoving');
                resolve();
            }, 1500);
        });
    }

    const accelerateWheel = async () => {
        handleWheelState('accelerating')
        initiateWheelSound();
        setInitialLoop(false)
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                setFinishedAccelerating(true)
                handleWheelState('spinning');
                resolve();
            }, 1500);
        });
    }

    useEffect(() => {
        if(isWheelResting){
            if (isWheelActive && wheelState === 'notMoving' && initialLoop) {
                setIsWheelResting(false);
                accelerateWheel();
            }
            else if (isWheelActive && prizeWon && wheelState !== 'notMoving') {
                setIsWheelResting(false);
                finishingRoll();
            } else if (!isWheelActive && wheelState !== 'notMoving' && (wheelState === 'spinning' || wheelState === 'accelerating')) {
                setIsWheelResting(false);
                finishingRoll();
            }
        }
    }, [isWheelActive, wheelState, prizeWon, finishedAccelerating]);

    const rotateSpring = useSpring({
        from: { rotation:  isNaN(prizeAngle) ? 70 : prizeAngle },
        to: async(next, cancel) => {
            if (wheelState === 'notMoving') {
                await next({ rotation: isNaN(prizeAngle) ? 70 : prizeAngle });
            }
            else if(wheelState === 'accelerating'){
                await next({ rotation: 360 * 4, config: {duration: 1500, easing: easings.easeInQuad } })
                await next({ rotation: 0, config: { duration: 0 } });
                setIsPrizeVisible(false);
            }
            else if(wheelState === 'spinning'){
                while(isWheelActive && prizeWon === null){
                    await next({ to: [{rotation: 360}], delay:0, config: { duration: 200, easing: t => t}}); 
                    await next({ rotation: 0, config: { duration: 0 }});
                }
            } 
            else if (wheelState === 'decelerating') {
                await next({ rotation: (360 * 9)+ prizeAngle, config: { duration: 1500, easing: easings.easeOutSine } });
              }  else {
                console.log('Reached unexpected state')
              }
        },
        reset: wheelState === 'notMoving',
        onRest: () => {
            setIsWheelResting(true)
            // Sounds on play
            if (wheelState === 'decelerating') {
                if(!prizeWon && typeof timeoutSound != "undefined" && timeoutSound.current){
                    timeoutSound?.current?.play();
                }
                if (prizeWon && prizeWon.prizeType === '0') {
                    if(typeof outcome_bust != "undefined" && outcome_bust.current){
                        outcome_bust?.current?.play();
                    }
                }
            }
        },
    })

    //isWheelActive, initialLoop, initiateWheel

    const getAngle = () => {
        if (prizeWon) {
            const sliceIndex = parseInt(prizeWon.prizeType); // Get the index of the selected prize
            const sliceMiddleAngle = (sliceIndex * angle) - (angle / 2); // Calculate the middle of the slice
            return 360 - sliceIndex* angle + 70;
        }
        return prizeAngle;
    }




    const CircleWithSlices = () => {
        // Function to create a single slice path
        const createSlicePath = (startAngle: number, endAngle: number) => {
            const x1 = 50 + 50 * Math.cos((Math.PI / 180) * startAngle);
            const y1 = 50 + 50 * Math.sin((Math.PI / 180) * startAngle);
            const x2 = 50 + 50 * Math.cos((Math.PI / 180) * endAngle);
            const y2 = 50 + 50 * Math.sin((Math.PI / 180) * endAngle);
            const largeArcFlag = angle > 180 ? 1 : 0;
            return `M 50,50 L ${x1},${y1} A 50,50 0 ${largeArcFlag} 1 ${x2},${y2}Z`;
        };
    
        // Function to calculate text transformation
        const calculateTextTransform = (startAngle: number, endAngle: number) => {
            const midAngle = (startAngle + endAngle) / 2;
            const x = 50 + 50 * Math.cos((Math.PI / 180) * midAngle);
            const y = 50 + 50 * Math.sin((Math.PI / 180) * midAngle);
            return `rotate(${midAngle}, ${x}, ${y})`;
        };
    
        const renderPaths = () => {
            return prizes.map((prize, index) => {
                const startAngle = index * angle;
                const endAngle = startAngle + angle;
                return (
                    <path
                        key={index}
                        d={createSlicePath(startAngle, endAngle)}
                        fill={prize.color}
                    />
                )
            })
        };
    
        const renderTexts = () => {
            return prizes.map((prize, index) => {
                const startAngle = index * angle;
                const endAngle = startAngle + angle;
    
                return (
                    <text
                        key={index}
                        className="font-playwriteNZ font-bold"
                        x="10"
                        y="25" // Adjust this to center vertically inside the slice
                        textAnchor="middle"
                        fill="white"
                        fontSize={prize.type === 2 ? "4" : "5"} // Adjust font size as needed
                        transform={`translate(50,50) rotate(${(startAngle - (angle/2))}) rotate(${189+angle}) translate(-40,-20)`}
                    >
                        {prize.type === 0 ? 'Bust'
                            : prize.type === 1 ? 'Item'
                            : prize.type === 2 ? 'Itty bitty WEI'
                            : prize.type === 3 ? 'NICE WEI'
                            : prize.type === 4 ? 'JACKPOT'
                            : null}
                    </text>
                );
            });
        };
    
        return (
            <svg viewBox="0 0 100 100" width="100%" height="100%">
                    {renderPaths()}
                    {renderTexts()}
            </svg>
        );
    };

    const closePrizeLayer = () => {
        handlePrizeWon(null);
        setIsPrizeVisible(false);
        handleWheelState('notMoving');
        handleIsTransactionFinished(true);
        setInitialLoop(true);
        handleReroll(false);
        setIsLightActive(false);
    }

    const acceptPrize = async () => {
        handleWrite();
        handlePrizeWon(null);
        handleWheelState('notMoving');
        handleIsTransactionFinished(true);
        setInitialLoop(true);
        handleReroll(false);
        setIsLightActive(false);
        await new Promise<void>(resolve => setTimeout(resolve, 2000));
        handleIsAcceptingPrize(false);
    }
    /*
        Wheel Active: False (Undergoing animation)
        Wheel State: Not Moving
        Prize: NULL
        InitialLoop: true
        isReroll: False
    */

    const lightbulbCount = 20; // Number of lightbulbs

    const Lightbulbs = ({ count, radius, isLightActive }: {count:number, radius:number, isLightActive:boolean}) => {
        const bulbs = [];
        const bulbSize = ( getScreenBreakpoint() === 'def' ? 10 
            : getScreenBreakpoint() === 'xs' ? 15
            : getScreenBreakpoint() === 'lg'? 20
            // : getScreenBreakpoint() === '3xl' ? 25
            : 40
        );
        const offsetRadius = radius + bulbSize / 2;
    
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * 2 * Math.PI;
            const x = (offsetRadius + offsetRadius * Math.cos(angle) - bulbSize / 2) + (
                getScreenBreakpoint() === 'def' ? 6 
                : getScreenBreakpoint() === 'xs'? 9 
                : getScreenBreakpoint() === 'lg'? 15 
                // : getScreenBreakpoint() === '3xl'? 24
                : 47
            );
            const y = (offsetRadius + offsetRadius * Math.sin(angle) - bulbSize / 2) + (
                getScreenBreakpoint() === 'def' ? 13 
                : getScreenBreakpoint() === 'xs'? 25 
                : getScreenBreakpoint() === 'lg'? 16
                // : getScreenBreakpoint() === '3xl'? 22
                : 35
            );
    
            bulbs.push(
                <div
                    key={`bulb-${i}`}
                    className={`${isLightActive ? 'lightbulb' : ''}`}
                    style={{
                        position: 'absolute',
                        width: `${bulbSize}px`,
                        height: `${bulbSize}px`,
                        borderRadius: '50%',
                        backgroundColor: 'black',
                        top: `${y}px`,
                        left: `${x}px`,
                    }}
                />
            );
        }
    
        return <>{bulbs}</>;
    };

    return (
        <div className="relative flex flex-col justify-end items-center h-full w-full">
            {isPrizeVisible && prizeWon && prizeWon?.prizeType !== '0' ?
                <PrizeRing 
                    acceptPrize={acceptPrize}
                    isPrizeVisible={isPrizeVisible}
                    prizeWon={prizeWon}
                    handleAccept={handleAccept}
                    getScreenBreakpoint={getScreenBreakpoint}
                    closePrizeLayer={closePrizeLayer}
                />
            : null }
            {/* 
                75% for side banner [30% of screen]
                30% jackpot [55% of screen]
            */}
            <div className="absolute flex justify-center
             w-[250px] h-[250px] xs:w-[400px] xs:h-[400px] lg:w-[530px] lg:h-[530px] 4xl:w-[1320px] 4xl:h-[1320px] my-4 ">
                <div className="absolute top-[-20%] h-[40%] w-[150%] flex justify-center items-center  ">
                    <div className="px-2 text-start relative bg-[url('/jackpotWheel/banner-small.png')] bg-cover bg-center flex flex-col font-ibmPlexMono 
                        top-[-85px] xs:top-[-90px] lg:top-[-90px] 4xl:top-[-110px] 
                        left-[-10px] xs:left-[-10px] lg:left-[-20px] 4xl:left-[-55px]
                        w-[85px] xs:w-[118px] lg:w-[159px] 4xl:w-[396px] 
                        h-[64px] xs:h-[89px] lg:h-[119px] 4xl:h-[297px]
                        pt-[10px] 4xl:pt-[2rem]
                    ">
                       <p className="text-xs 4xl:text-4xl text-white m-0 p-0">
                            Small
                        </p>
                    {
                        prizeSmall != undefined  &&
                        <div className="flex flex-wrap w-full justify-start overflow-hidden">
                            <div className="text-[10px] xs:text-[.9rem] lg:text-xl 4xl:text-5xl text-white text-left truncate">
                                        {parseInt(formatGwei(prizeSmall)) * 1.5} <br/>
                                        GWEI 
                            </div>
                        </div>
                    }
                    </div>
                    <div className="relative z-10 bg-[url('/jackpotWheel/banner-jackpot.png')] bg-cover bg-center flex flex-col font-ibmPlexMono px-[-5px] 
                        top-[-110px] xs:top-[-120px] lg:top-[-140px] 4xl:top-[-200px]
                        w-[128px] xs:w-[218px] lg:w-[291px] 4xl:w-[726px]
                        h-[39px] xs:h-[65px] lg:h-[87px] 4xl:h-[217px]
                        pt-[0.3rem] 4xl:pt-[1.2rem]
                    ">
                        <p className="font-semibold text-xs xs:text-sm lg:text-base 4xl:text-5xl p-0 m-0 text-black">
                            JACKPOT 
                        </p>
                        <div className="flex w-full justify-center">
                            <div className="w-full h-full font-bold text-black text-sm xs:text-xl lg:text-3xl 4xl:text-6xl">
                                { 
                                    deployedContractData &&
                                    <JackpotBalance address={deployedContractData.address} />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="text-end px-2 relative bg-[url('/jackpotWheel/banner-medium.png')] bg-cover bg-center flex flex-col font-ibmPlexMono 
                        top-[-85px] xs:top-[-90px] lg:top-[-90px] 4xl:top-[-108px] 
                        left-[10px] xs:left-[10px] lg:left-[20px] 4xl:left-[55px]
                        w-[85px] xs:w-[118px] lg:w-[159px] 4xl:w-[396px]
                        h-[64px] xs:h-[89px] lg:h-[119px] 4xl:h-[297px]
                        pt-[10px] 4xl:pt-[2rem]
                    ">
                       <p className="text-xs 4xl:text-4xl text-white m-0 p-0">
                            Medium
                        </p>
                        <div className="lg:pt-1 flex flex-wrap grow justify-end w-full">
                            { 
                                    deployedContractData &&
                                    <MediumJackpotBalance address={deployedContractData.address}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative h-full w-full flex justify-center items-center">
                <animated.div
                    className="
                        z-[10] sm:border sm:border-[black] sm:border-[5px] relative flex justify-center items-center my-4 rounded-[50%]
                        w-[250px] h-[250px] w-[250px] h-[250px] xs:w-[400px] xs:h-[400px] lg:w-[530px] lg:h-[530px] 4xl:w-[1320px] 4xl:h-[1320px]
                    "
                    style={{ 
                        transform: rotateSpring.rotation.to((r) => {
                            return `rotate(${r}deg)`
                        })
                    }}
                >
                    <CircleWithSlices />
                </animated.div>
                
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                    <div 
                        className="relative z-[0] bg-[#493313] w-full h-full rounded-full border-black border-[5px]" 
                        style={{ 
                            width: `${
                                getScreenBreakpoint() === 'none' ? '0'
                                : getScreenBreakpoint() === 'def'  ? '315' 
                                : getScreenBreakpoint() === 'xs' ? '480'
                                : getScreenBreakpoint() === 'lg' ? "600" 
                                // : getScreenBreakpoint() === '3xl' ? "950"
                                : "1500" //4xl and above
                            }px`, 
                            height: `${
                                getScreenBreakpoint() === 'none' ? '0'
                                : getScreenBreakpoint() === 'def' ? '315' 
                                : getScreenBreakpoint() === 'xs'? '480' 
                                : getScreenBreakpoint() === 'lg'? "600" 
                                // : getScreenBreakpoint() === '3xl' ? "950"
                                : "1500" //4xl and above
                            }px` 
                        }}
                    >
                        <Lightbulbs count={lightbulbCount} isLightActive={isLightActive} radius={(
                            getScreenBreakpoint() === 'none' ? 0
                            : getScreenBreakpoint() === 'def' ? 307-40 
                            :  getScreenBreakpoint() === 'xs'? 470-60 
                            : getScreenBreakpoint() === 'lg'? 620-80
                            // : getScreenBreakpoint() === '3xl' ? 965-100
                            : 1515-160
                            )/2} />
                    </div>
                </div>
            </div>
            <div className="absolute z-[10] left-[50%] bottom-[40px] lg:bottom-[65px] 4xl:bottom-[80px] transform -translate-x-1/2 translate-y-0 h-[45px]">
                <svg 
                    width={
                        getScreenBreakpoint() === 'none' ? '0' 
                        :(getScreenBreakpoint() === 'def' || getScreenBreakpoint() === 'xs' ) ? "40" 
                        : (getScreenBreakpoint() === 'lg') ? '55'
                        // : (getScreenBreakpoint() === '3xl') ? '65'
                        : '120'
                    } 
                    height={(getScreenBreakpoint() === 'none' ? '0'
                        :getScreenBreakpoint() === 'def' || getScreenBreakpoint() === 'xs' ) ? "40" 
                        : (getScreenBreakpoint() === 'lg') ? '55'
                        // : (getScreenBreakpoint() === '3xl') ? '65'
                        : '120'
                    } 
                    viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4 L35 40 Q20 40 5 40 Z" fill="white"/>
                </svg>
            </div>    
        </div>
    )    
}