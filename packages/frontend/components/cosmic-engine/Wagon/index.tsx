'use client';
 

import WagonCard from '~~/components/cosmic-engine/Wagon/WagonCard';
import EquippedWagon from '~~/components/cosmic-engine/Wagon/EquippedWagon';
import Inventory from '~~/components/cosmic-engine/Wagon/Inventory';
import { getItemLayerData } from "@/lib/actions/ora"
import { uint8ArrayToSrc } from '@/utils/cosmic-engine/ora-client';
import { 
    JJ_CONTRACT_NAME,
    ITEM_ID_IMAGE_LAYER_NAMES,
    TIER_COLORS,
    TIER_TEXT_COLORS,
    CRAFT_COST
} from '@/lib/constants';
import { useEffect, useState, useReducer } from "react";
import { get } from 'http';
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi"
import { Address } from 'viem';
import { useGlobalState } from "~~/services/store/store";
import Image from 'next/image';

export default function WagonScreen(){

    type Item = {
        name: string;
        base64image: string;
        amount: string;
    }
    
    const sampleData = {
        name: "Sample Card",
        imageUrl: "https://robohash.org/Any robot you dont click on, they dismantle.",
        tier: 3,
    }

    const { address } = useAccount();
    const [inventoryData, setInventoryData] = useState<Item[]>();
    const [tier, setTier] = useState(1);
    const itemImages = useGlobalState(state => state.itemImages);
    const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);
    const [isArrowPrevPressed, setIsArrowPrevPressed] = useState(false);
    const [isArrowNextPressed, setIsArrowNextPressed] = useState(false);
    const arrowImage = '/wagon/arrow.png';
    const arrowPressedImage = '/wagon/arrow-pressed.png';

    // const { data: hasBonus } = useScaffoldReadContract({
    //     contractName: JJ_CONTRACT_NAME,
    //     functionName: "hasBonus",
    //     args: [address],
    //     interval: 5000
    // });

    const { data: balanceOfBatch } = useScaffoldReadContract({
        contractName: JJ_CONTRACT_NAME,
        functionName: "balanceOfBatch",
        args: [accountsArray(), idsArray()],
        watch: false
    });

    const { data: equippedBeasts } = useScaffoldReadContract({
        contractName: JJ_CONTRACT_NAME,
        functionName: "EquippedBeasts",
        args: [address]
    });    

    const { data: equippedBody } = useScaffoldReadContract({
        contractName: JJ_CONTRACT_NAME,
        functionName: "EquippedBody",
        args: [address]
    });    
    const { data: equippedCover } = useScaffoldReadContract({
        contractName: JJ_CONTRACT_NAME,
        functionName: "EquippedCover",
        args: [address]
    });    
    const { data: equippedWheels } = useScaffoldReadContract({
        contractName: JJ_CONTRACT_NAME,
        functionName: "EquippedWheels",
        args: [address]
    });    



    function accountsArray() {

        let accounts : Address[] = [];

        for (let i=0; i < ITEM_ID_IMAGE_LAYER_NAMES.length; i++) {
            if (address) {
                accounts.push(address);
                }
            }

        return accounts;
    }

    function idsArray() {

        let ids : bigint[] = [];

        for (let i=0; i < ITEM_ID_IMAGE_LAYER_NAMES.length; i++) {
            ids.push(BigInt(((tier - 1) * ITEM_ID_IMAGE_LAYER_NAMES.length) + i));
        }

        return ids;
    }

    const incrementTier = () => {
        setTier(prevTier => prevTier + 1);
    }
    
    const decrementTier = () => {
        setTier(prevTier => prevTier > 1 ? prevTier - 1 : 1);
    }

    async function loadInventory() {
        
        // example inventoryData
        let inventoryData: Item[] = [];

        for (let i=0; i < ITEM_ID_IMAGE_LAYER_NAMES.length; i++) {
            const amount = balanceOfBatch ? balanceOfBatch[i].toString() : "0";

            inventoryData.push({
                name: ITEM_ID_IMAGE_LAYER_NAMES[i][1],
                base64image: uint8ArrayToSrc(itemImages[i]), 
                amount: amount,
            });

        }

        setInventoryData(inventoryData);
    }    

    useEffect(() => {
        loadInventory();
        }, [balanceOfBatch, tier, refreshDisplayVariables]);  
            

    return (
        <div className="flex justify-center h-full">
            <div className="overflow-x-hidden text-[black] h-full justify-center items-center px-[1rem] pt-1 max-w-[720px]">
                <div className="bg-[#1B1B1B] w-full flex flex-col grow h-full gap-y-4 px-4 rounded-b-2xl border-solid border-[2px] border-[#FF7200]">
                    {/* Wagon Section */}
                    <div className="flex gap-x-4 justify-center items-center pt-5">
                        <div className="relative aspect-[57/37] w-[80px]">
                            <div className="absolute w-full h-full ">
                                <Image fill src="/wagon/skull-detail.png" alt='cow skull'/>
                            </div>
                        </div>
                        <div className="flex-col justify-start">
                            <p className="font-bold text-lg lg:text-2xl text-[#FF7200]" style={{ lineHeight: '0.25rem' }}>Your Wagon</p>
                            <p className="text-[#FF7200] text-xs lg:text-sm">Equip a full set to get better spin odds!</p>
                        </div>
                    </div>

                    <div className="flex flex-col h-full max-h-[20%] gap-x-4">
                        {/* 2.60 */}
                        <div className="relative flex justify-between items-center gap-x-6 w-full h-full py-4">
                            <div className="absolute inset-0 bg-gray-300 opacity-[0.05]"/>
                            <div className=" flex justify-center w-full">
                                <div className=" w-[260px] xs:w-[400px] md:w-[400px] h-[156px] xs:h-[240px] md:h-[240px] -top-2 relative ">
                                    {
                                        <EquippedWagon 
                                            equippedBeasts={equippedBeasts}
                                            equippedBody={equippedBody}
                                            equippedCover={equippedCover}
                                            equippedWheels={equippedWheels}
                                        />
                                    }
                                    
                                </div>
                            </div>
                            {/* <div className="hidden xl:flex min-w-[380px] justify-center items-center gap-x-4">
                                <WagonCard cardData={sampleData}/>
                                
                            </div> */}
                        </div>
                        {/*
                        <div className="flex grow w-full justify-center items-end gap-x-4">
                            <WagonCard cardData={sampleData}/>
                            <WagonCard cardData={sampleData}/>
                            <WagonCard cardData={sampleData}/>
                            <WagonCard cardData={sampleData}/>
                        </div>
                        */}
                    </div>

                    <div className="w-full border border-[1px] border-[#FF7200]" /> {/* divider */}
                    <div className="flex justify-between items-center">
                        <div 
                            className="relative rotate-180 cursor-pointer aspect-[44/13] w-[32px]" 
                            onClick={decrementTier} 
                            onMouseDown={()=> {setIsArrowPrevPressed(true)}}
                            onMouseUp={()=> {setIsArrowPrevPressed(false)}}
                            onMouseLeave={()=> {setIsArrowPrevPressed(false)}}
                        >
                            <div className="absolute inset-0">
                                <Image fill src={isArrowPrevPressed ? arrowPressedImage : arrowImage } alt="arrow prev"/>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-[#FF7200]" style={{ lineHeight: '0.25rem' }}>TIER {tier} </p>
                            <p className="text-xs text-[#FF7200]">COMBINE {CRAFT_COST} TO LEVEL UP </p>
                        </div>
                        <div 
                            className="relative cursor-pointer aspect-[44/13] w-[32px]"
                            onClick={incrementTier}
                            onMouseDown={()=> {setIsArrowNextPressed(true)}}
                            onMouseUp={()=> {setIsArrowNextPressed(false)}}
                            onMouseLeave={()=> {setIsArrowNextPressed(false)}}
                        >
                            <div className="absolute inset-0">
                                <Image fill src={isArrowNextPressed ? arrowPressedImage : arrowImage } alt="arrow prev"/>
                            </div>
                        </div>
                    </div>                    
                    {/* Market/Inventory Section */}
                    {
                        inventoryData?.length ?
                        <Inventory 
                            data={inventoryData} 
                            tier={tier} 
                            refreshDisplayVariables={refreshDisplayVariables}
                            triggerRefreshDisplayVariables={triggerRefreshDisplayVariables}
                        />
                        :
                        <div className="flex justify-center items-center h-full">
                            <p className="text-lg">Loading items...</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}