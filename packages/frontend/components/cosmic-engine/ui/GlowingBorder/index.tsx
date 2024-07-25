import { FC, ReactNode } from "react";
import styles from "./styles.module.scss";

type GlowingBorderProps = {
    children: ReactNode;
    tier: number;
  };
  

const GlowingBorder: FC<GlowingBorderProps> = ({ children, tier }) => {
    return (
        <div className="relative w-full h-full">
            <div className={`${styles[`glowing-card-tier${tier < 7 ? tier : 7}`]}`} 
            >
                {children}
            </div>
        </div>
    );
}

export default GlowingBorder;