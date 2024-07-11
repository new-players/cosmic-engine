import React, { useEffect, useState } from 'react';
import { useSpring, useSpringRef, animated, config, easings } from '@react-spring/web';
import ItemImage from "./ItemImage";
import DegenCard from "./DegenCard";
import { confetti } from "@tsparticles/confetti";
import Lottie from 'react-lottie';
import Loader from '~~/components/cosmic-engine/AcceptLoader';
import { Prize } from './JackpotJunction';
interface PrizeRingProps {
    isPrizeVisible: boolean;
    prizeWon: Prize; 
    handleAccept: () => void;
    closePrizeLayer: () => void;
    getScreenBreakpoint: () => string;
    acceptPrize: () => void;
}

export const PrizeRing = ({
    isPrizeVisible,
    prizeWon,
    handleAccept,
    closePrizeLayer,
    getScreenBreakpoint,
    acceptPrize
}: PrizeRingProps) => {
    const [isMounted, setIsMounted] = useState(true);
    const [isShaking, setIsShaking] = useState(false);
    const [fastShaking, setFastShaking] = useState(false);
    // Animations
    const animationData = require('~~/assets/falling-confetti.json');
    // Sounds
    const outcome_bust = new Audio('/sounds/outcome_bust.wav');
    const outcome_item = new Audio('/sounds/outcome_item.wav');
    const outcome_small = new Audio('/sounds/outcome_small.wav');
    const outcome_medium = new Audio('/sounds/outcome_medium.wav');
    const outcome_jackpot = new Audio('/sounds/outcome_jackpot.wav');

    useEffect(() => {
        if(prizeWon?.prizeType === '1'){
            outcome_item.play();
        } else if (prizeWon?.prizeType === '2') {
            outcome_small.play();
        } else if (prizeWon?.prizeType === '3') {
            outcome_medium.play();
        } else if (prizeWon?.prizeType === '4') {
            outcome_jackpot.play();
        } else {
            outcome_bust.play();
        }    
    }, []);

    
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData,
        speed: 0.1
    };

    const shakeSpring = useSpring({
        from: { x: 0, opacity: 0 },
        to: isMounted ? 
        [   
            { x: -10, opacity: .2 },
            { x: 10 },
            { x: -10 },
            { x: 10, opacity: .4 },
            { x: -10 },
            { x: 10 },
            { x: -10, opacity: .6},
            { x: 8 },
            { x: -8 },
            { x: 6, opacity: .8 },
            { x: -6 },
            { x: 4},
            { x: 0, opacity: 1  },
        ] : isShaking ? 
        [
            { x: 10 },
            { x: -10 },
            { x: 8 },
            { x: -8 },
            { x: 6 },
            { x: 0 },
        ]
        : { x: 0 },
        onRest: async () => {
            if(isMounted){
                setIsMounted(false)
            }
            if(isShaking){
                setIsShaking(false)
                await new Promise(resolve => setTimeout(resolve,800));
                acceptPrize()
            }
        },
        config: { 
            duration: isMounted ? 50 : 120,
            mass: 1,
            tension: 500,
            friction: 20,
            easing: easings.easeOutCubic,
        },
    })
    
    const handlePrizeAccept =() => {
        handleAccept()
        setIsShaking(true);
        confetti({
            particleCount: 200,
            spread: 140,
            origin: { y: 0.5},
        });
    }

    return (
        <div className="absolute top-12 4xl:top-0 h-full w-full z-20" style={{
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
        }}>
            <animated.div 
                className="absolute h-full w-full" 
                style={{
                    ...shakeSpring,
                }}
            >
                <div className="absolute z-40 top-[-3.5rem] sm:top-[-2rem] left-0 w-full h-full flex justify-center items-start">
                    <div className="h-[80%] w-[63%] relative">
                        {
                            prizeWon?.prizeType === '1' ?
                                <ItemImage itemId={prizeWon?.prizeValue}/>
                            :
                                <DegenCard type={prizeWon?.prizeType} degen={prizeWon?.prizeValue}/>
                        }
                    </div>
                </div>
                <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
                    <div className={`overflow-hidden flex-col flex border ease-in border-[5px] bg-[#7a4f9b] rounded-[50%] h-full w-full`}>
                        <div className="h-[70%] overflow-hidden "> 
                            <Lottie options={defaultOptions} height="150%" width="100%" />
                        </div>
                        <button className="grow z-50 accept-ring cursor-pointer flex flex-col justify-start hover:animate-none" onClick={handlePrizeAccept}>
                            <Loader totalCount={10} closePrizeLayer={closePrizeLayer}/>
                            <p className={` text-4xl font-bold`}>
                                ACCEPT
                            </p>
                        </button>
                    </div>
                </div>
            </animated.div>
        </div>   
    )
}
export default PrizeRing;