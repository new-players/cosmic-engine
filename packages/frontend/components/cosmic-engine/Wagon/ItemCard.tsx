import CraftButton from './CraftButton';
import EquipButton from './EquipButton';
import GlowingBorder from '@/components/cosmic-engine/ui/GlowingBorder';
import Image from "next/image";
import { useScaffoldReadContract, } from "~~/hooks/scaffold-eth";
import { JJ_CONTRACT_NAME } from "@/lib/constants";
import { 
    TIER_COLORS, 
    CRAFT_COST,
    Item } from '@/lib/constants';

const ItemCard = ({key, item, index, selectedItem, handleItemClick, tier, triggerRefreshDisplayVariables}) => {
    // item type, terrain type
    const itemType = index%4;
    const itemTerrain = Math.floor((index)/4);
    const { data: CurrentTier } = useScaffoldReadContract({
        contractName: JJ_CONTRACT_NAME,
        functionName: "CurrentTier",
        args: [itemType , itemTerrain]
    });
    const isTopTier = (parseInt(CurrentTier)+1 === tier) && (parseInt(item.amount) >= 1) ;
    return (
        <div 
            className={`w-[100px] h-[100px] ${item === selectedItem ? 'selected' : ''}`} 
            key={item.name}
            onClick={() => handleItemClick(item)}
            style={
                item === selectedItem 
                ? {outline: "2px solid red", backgroundColor: TIER_COLORS[tier]} 
                : {backgroundColor: TIER_COLORS[tier]}}
        >
            <GlowingBorder tier={tier} isGlowing={!!(parseInt(item.amount) >= 1)}>
                <Image 
                    src={item.base64image} 
                    alt={item.name} 
                    width={100}
                    height={100}                                   
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
                        <div className="absolute -bottom-1 left-10 right-1/2 z-[50]">
                        <CraftButton 
                            item={item} 
                            tier={tier} 
                            index={index} 
                            triggerRefreshDisplayVariables={triggerRefreshDisplayVariables}
                            />                            
                        </div>
                    )
                }   
                { isTopTier ?
                    <div className="absolute w-full border bg-[white] bottom-0 font-bold text-center font-jost text-black">
                        Top Tier
                    </div>         
                : null
                }        
            </GlowingBorder>
        </div>
    )
}

export default ItemCard;