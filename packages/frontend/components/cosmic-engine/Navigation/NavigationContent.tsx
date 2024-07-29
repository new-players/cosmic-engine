'use client';

import { Suspense } from 'react';
import { JackpotJunction } from '~~/components/cosmic-engine'
import Wagon from '~~/components/cosmic-engine/Wagon'
import DegenGuy from '~~/public/degen-guy.png';
import Image from 'next/image';
import InstructionModal from "~~/components/cosmic-engine/instruction-modal";
import { useDispatch } from 'react-redux';
import { setIsOpen } from '~~/store/showInstructionsSlice';

export default function NavigationContent ({tab}: {tab: string | null}) {
    const dispatch = useDispatch();

    return(
        <div className="relative flex flex-col grow my-[1rem] 4xl:my-[8rem]">
            <div 
                className="absolute flex cursor-pointer justify-center items-center top-0 right-5 w-[28px] h-[28px] rounded-full border-[3px] border-solid border-[#6f2e71]" 
                onClick={() => {
                    dispatch(setIsOpen(true));

                }}
            >
                ?
            </div>
            <InstructionModal />
            { tab === 'wagon' ?
                <Suspense>
                    <Wagon />
                </Suspense>
            : tab === 'market' ?
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                position: 'relative'
            }}>
                <Image src={DegenGuy} alt="Degen Guy" style={{ 
                    width: '50%', 
                }}/>
                <div style={{ 
                    position: 'absolute', 
                    top: '65%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    fontSize: '2em', 
                    color: '#333',
                    background: '#f9f9f9', 
                    border: '5px solid #333',
                    padding: '10px',
                    borderRadius: '5px'
                }}>
                    Market coming soon!
                </div>
            </div>
            : 
                <Suspense>
                    <JackpotJunction />
                </Suspense>
            }
        </div>
    )
} 