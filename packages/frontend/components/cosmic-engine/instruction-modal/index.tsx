import {useState} from "react";
import Image from "next/image";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '~~/store/rootReducer';
import { setCurrentStep, setIsOpen } from '~~/store/showInstructionsSlice';

const introCard = (
    <div className="flex flex-col items-center justify-center gap-y-5 text-[#F1F1F1]">
        <h2 className="font-bold text-lg text-center">SPIN TO WIN!</h2>
        <div className="relative w-full aspect-square max-w-[180px]">
            <Image src="/instructionAssets/miniWheel.png" fill alt="Spin to win" />
        </div>
        <div className="flex flex-wrap flex-col gap-y-4 w-full px-2">
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div >
                    Spin the wheel to win items and ETH!
                </div>
            </div>
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div >
                    One spin costs 100 GWEI.
                </div>
            </div>
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div>
                    Collect items and build a wagon to unlock the Bonus Wheel. (It boosts your odds of winning items and ETH.)
                </div>
            </div>
        </div>
    </div>
);

const respinCard = (
    <div className="flex flex-col items-center justify-center gap-y-5 text-[#F1F1F1]">
        <h2 className="font-bold text-lg text-center">ACCEPT OR RESPIN</h2>
        <div className="relative w-full aspect-[3/4] max-w-[180px]">
            <Image src="/instructionAssets/respin.png" fill alt="Accept or respin" />
        </div>
        <div className="flex flex-wrap flex-col gap-y-4 w-full px-2">
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div >
                    Accept your prize or respin before the timer runs out!
                </div>
            </div>
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div >
                    Respins are cheaper than regular spins (25 vs 100 GWEI).
                </div>
            </div><div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div >
                    Hurry: Unclaimed prizes go poof!
                </div>
            </div>
        </div>
    </div>
);

const bonusWheelCard = (
    <div className="flex flex-col items-center justify-center gap-y-5 text-[#F1F1F1]">
        <h2 className="font-bold text-lg text-center">UNLOCK THE BONUS WHEEL</h2>
        <div className="relative w-full aspect-square max-w-[180px]">
            <Image src="/instructionAssets/bonus.png" fill alt="Bonus wheel" />
        </div>
        <div className="flex flex-wrap flex-col gap-y-4 w-full px-2">
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div >
                    To unlock the Bonus Wheel, build a top-tier wagon of matching parts.
                </div>
            </div>
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div >
                    Matching = same terrain (same row)
                </div>
            </div><div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div >
                    Top tier = the highest-tier version of that item that any player has crafted
                </div>
            </div>
        </div>
    </div>
);

const wagonCard = (
    <div className="flex flex-col items-center justify-center gap-y-5 text-[#F1F1F1]">
        <h2 className="font-bold text-lg text-center">BUILD YOUR WAGON</h2>
        <div className="relative w-full aspect-square max-w-[180px]">
            <Image src="/instructionAssets/wagon.png" fill alt="Bonus wheel" />
        </div>
        <div className="relative flex flex-wrap flex-col gap-y-4 w-full px-2">
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div>
                    Equip and upgrade your wagon on the Inventory screen.
                </div>
            </div>
            <div className="relative w-full pt-[11%]">
                <Image src="/instructionAssets/menu.png" fill alt="menu" />
            </div>
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div >
                    Select an item and choose Equip to add it to your wagon.
                </div>
            </div>
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div >
                    Choose items from the same terrain (same row).
                </div>
            </div>
            <div className="relative w-full pt-[24.75%]">
                <Image src="/instructionAssets/matching-row.png" fill alt="matching row" />
            </div>
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div>
                    Upgrade items by combining two items of the same tier and type.
                </div>
            </div>
        </div>
    </div>
);

const conclusionCard = (
    <div className="flex flex-col items-center justify-center gap-y-5 text-[#F1F1F1]">
        <h2 className="font-bold text-lg text-center">GOT IT?</h2>
        <div className="relative flex flex-wrap flex-col gap-y-4 w-full px-2">
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div>
                    Spin the wheel. Win items and ETH.
                </div>
            </div>
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div >
                    Accept the outcome or respin.
                </div>
            </div>
            <div className="flex gap-2 justify-start items-center w-full">
                <div className="rounded-full w-[10px] h-[10px] bg-[white] opacity-20 flex-shrink-0"></div>
                <div >
                    Collect items, upgrade to a top-tier wagon, and unlock the bonus wheel to up your odds of winning ETH.
                </div>
            </div>
        </div>
    </div>
)

// To create a new instruction card, add a new jsx card to the instructionContents array.
const instructionContents = [
    introCard,
    respinCard,
    bonusWheelCard,
    wagonCard,
    conclusionCard,
]


const InstructionModal = () => {
    const dispatch = useDispatch();
    const currentStep = useSelector((state: RootState) => state.showInstructions.currentStep);
    const isOpen = useSelector((state: RootState) => state.showInstructions.isOpen);
    return (
        <div className={`fixed inset-0 ${isOpen ? 'flex' : 'hidden'} items-center justify-center z-50`}>
            <div className={`modal ${isOpen ? "modal-open" : ''}`}>
                <div className="modal-box bg-[#1D1D1D] border-solid border-[1px] border-[#F1CF14]">
                    <div className="w-full h-[460px] overflow-y-auto relative ">
                        <div className="carousel">
                            {
                                instructionContents.map((content, index) => {
                                    return (
                                        <div key={index} className={`carousel-item w-full ${currentStep === index ? 'block' : 'hidden'}`}>
                                            {content}
                                        </div>
                                    );
                                })
                            }

                        </div>
                    </div>
                    <div className="flex w-full justify-center gap-2 py-6">
                        { instructionContents.map((content, index) => {
                            return (
                                <button
                                    key={index}
                                    className={`rounded-full w-2 h-2 bg-[#F1CF14] hover:bg-[#F1CF14] hover:opacity-100 ${currentStep >= index ? 'opacity-100': 'opacity-50'}`}
                                    onClick={()=>{
                                        dispatch(setCurrentStep(index));
                                    }}
                                />
                            );
                        })}
                    </div>
                    <button 
                        className="w-full btn rounded bg-[#3D088F] border-solid border-[1px] border-[#EB28E3] text-[#EB28E3] text-lg font-jost font-bold hover:bg-[#5A2EBF] hover:text-[#C01CBA]"
                        onClick={()=>{
                            if(currentStep < instructionContents.length - 1){
                                dispatch(setCurrentStep(currentStep + 1));
                            } else {
                                dispatch(setIsOpen(false));
                            }
                        }}
                    >
                        {currentStep < instructionContents.length - 1 ? 'NEXT' : 'START'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InstructionModal;