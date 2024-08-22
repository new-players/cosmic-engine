import { useState } from 'react';
import { Item } from '@/lib/constants';
import ItemCard from "./ItemCard";

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
            {data.map((item, index) => {
                return (
                    <ItemCard 
                        key={`item_${index}`}
                        item={item}
                        index={index}
                        selectedItem={selectedItem}
                        handleItemClick={handleItemClick}
                        tier={tier}
                        refreshDisplayVariables={refreshDisplayVariables}
                        triggerRefreshDisplayVariables={triggerRefreshDisplayVariables}/>
                )})};
        </div>
    )
}