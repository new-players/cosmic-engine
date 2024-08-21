import { FC, ReactNode } from "react";
import styles from "./styles.module.scss";

type GlowingBorderProps = {
    children: ReactNode;
    tier: number;
  };
  

const GlowingBorder: FC<GlowingBorderProps> = ({ children, tier, isGlowing }) => {
    return (
        <div className="relative w-full h-full">
            {  isGlowing ?
                <div className={`${styles[`glowing-card-tier${tier < 7 ? tier : 7}`]} relative `} 
                >
                    {children}
                </div>
            :
                <div className="w-full h-full p-[0.7rem] flex justify-center items-center border-solid border-[white] border-[3px] bg-[#1B1B1B]">
                    {children}
                </div>
            }
        </div>
    );
}

export default GlowingBorder;