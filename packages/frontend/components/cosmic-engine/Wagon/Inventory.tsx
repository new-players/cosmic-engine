import { useState, useEffect, useReducer } from 'react';
import Image from "next/image";
import { 
    TIER_COLORS, 
    CRAFT_COST,
    Item } from '@/lib/constants';
import CraftButton from './CraftButton';
import EquipButton from './EquipButton';

interface InventoryProps {
    data: Item[];
    tier: number;
    refreshDisplayVariables: boolean;
    triggerRefreshDisplayVariables: () => void;    
}


export default function Inventory ({
    data,
    tier,
    refreshDisplayVariables,
    triggerRefreshDisplayVariables
    }
    : InventoryProps) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
    }

    return (
        
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 gap-4 place-items-center" >
            {data.map((item, index) => (
                <div 
                    className={`relative border w-[100px] h-[100px] bg-[#B4B4B4] ${item === selectedItem ? 'selected' : ''}`} 
                    key={item.name}
                    onClick={() => handleItemClick(item)}
                    style={
                        item === selectedItem 
                        ? {outline: "2px solid red", backgroundColor: TIER_COLORS[tier]} 
                        : {backgroundColor: TIER_COLORS[tier]}}
                >
                    <Image 
                        src={item.base64image} 
                        alt={item.name} 
                        width={100}
                        height={100}
                        style={
                            item.amount === '0' ?
                            {
                            filter: 'grayscale(100%) brightness(25%)',
                            }: {}
                        }                                            
                    />                    
                    <div className={`${parseInt(item.amount) >= CRAFT_COST ? 'bg-blue-500' : 'bg-gray-500'}
                    absolute -top-4 -right-2 m-1 rounded-full text-white text-center w-6 h-6 flex items-center justify-center`}>{item.amount}</div>
                    {
                        item === selectedItem && (
                            parseInt(item.amount) >= 1 && 
                            <div className="absolute px-10 top-14 left-1 text-center">
                            <EquipButton item={item} tier={tier} index={index} />                            
                            </div>
                        )
                    }                    

                    {
                        item === selectedItem && (
                            parseInt(item.amount) >= CRAFT_COST && 
                            <div className="absolute -bottom-1 left-10 right-1/2">
                            <CraftButton 
                                item={item} 
                                tier={tier} 
                                index={index} 
                                triggerRefreshDisplayVariables={triggerRefreshDisplayVariables}
                                />                            
                            </div>
                        )
                    }                    
                </div>
            ))}
        </div>
    )
}