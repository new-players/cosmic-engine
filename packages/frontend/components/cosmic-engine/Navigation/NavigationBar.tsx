'use client';

import { useState, useEffect, Suspense } from 'react';
import { JackpotJunction } from "~~/components/cosmic-engine/JackpotJunction";
import Image from 'next/image';
import RollIcon from '~~/public/roll-icon.png';
import WagonIcon from '~~/public/wagon-icon.png';
import MarketIcon from '~~/public/market-icon.png';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NavigationPage ({searchParams}: {searchParams: {tab: string | null; }}) {
    const router = useRouter();
    const { tab } = searchParams;

    const tabs = [
        { id: 0, title: 'roll', icon: RollIcon },
        { id: 1, title: 'wagon', icon: WagonIcon},
        { id: 2, title: 'market', icon: MarketIcon},
    ];
    
    return (
        <div className="flex w-full justify-center p-4">
            <div className="relative w-full max-w-[680px] 3xl:max-w-[700px] 4xl:max-w-[1000px] z-10 bg-slate-800 rounded border-solid border-[3px] border-[#dfc015] shadow-lg rounded-lg p-2 sm:p-2 flex justify-center items-center gap-x-2 sm:gap-x-4 lg:-gap-x-6 4xl:gap-x-20">
                <div className="absolute bottom-full right-0 w-[60px] h-[60px]  sm:w-[80px] sm:h-[80px] 3xl:w-[120px] 3xl:h-[120px] 4xl:w-[220px] 4xl:h-[220px]">
                    <Image src={'/tire-detail.png'} alt={'burning tire'} fill />
                </div>
                {tabs.map((currentTab, index) => (
                    <div key={currentTab.id} className={`px-4 ${index === 1 ? 'border-r border-l border-[#dfc015]':''}`}>
                        <button
                            key={currentTab.id}
                            className={`flex justify-center items-center px-4 py-2 rounded ${
                            tab === currentTab.title ? 'bg-gray-200' : (tab !== 'market' && tab !== 'wagon' && currentTab.id === 0) ? 'bg-gray-200': ''
                            }`}
                            onClick={() => router.push(`/?tab=${currentTab.title}`)}
                        >
                            { index === 1 ?
                            <div className="relative w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] 4xl:w-[150px] 4xl:h-[150px]">
                                <div className="absolute w-full h-full">
                                    <Image src={currentTab.icon} alt={`${currentTab.title} icon`} fill />
                                </div>
                            </div>
                            :
                            <div className="relative w-[20px] h-[20px] lg:w-[25px] lg:h-[25px] 4xl:w-[75px] 4xl:h-[75px]">
                                <div className="absolute w-full h-full">
                                    <Image src={currentTab.icon} alt={`${currentTab.title} icon`} fill />
                                </div>
                            </div>
                            }
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}