'use client'

import { useState, useEffect } from 'react';
import { useBlockNumber, useConfig } from 'wagmi';
import { Prize } from '~~/components/cosmic-engine/JackpotJunction';
import { useSelector } from 'react-redux';
import { RootState } from '~~/store/rootReducer';

interface AcceptLoader {
    totalCount: number;
    closePrizeLayer: () => void;
}

const AcceptLoader = ({totalCount, closePrizeLayer}: AcceptLoader) => {
    const config = useConfig()
    const blocksToAct = BigInt(20);
    const [count, setCount] = useState<number>(Number(blocksToAct));
    const { data: blockNumber } = useBlockNumber({
      config: config,
      watch: true,
      query:{
        refetchInterval: 100
      }
    });
    const [updatedBlockNumber, setUpdatedBlockNumber] = useState(blockNumber);
    const startBlock = useSelector((state: RootState) => state.startBlock.startBlock);
    const targetBlock = startBlock ? startBlock + blocksToAct : null; 

    useEffect(() => {
      if (blockNumber !== undefined && targetBlock !==null && blocksToAct !== undefined && startBlock !== null) {
        const blocksLeft = targetBlock - blockNumber;
        setCount(blocksLeft > 0 ? Number(blocksLeft) : 0);
        if (blocksLeft <= 0) {
          closePrizeLayer();
        }
      }
    }, [blockNumber, startBlock, blocksToAct, closePrizeLayer]);


    const Segment = ({index}: {index: number}) => {
        return (
          <div
            key={index}
            className={`grow-1 w-full ${index === 0 ? 'rounded-l-3xl' : index === Number(blocksToAct) - 1 ? 'rounded-r-3xl' : ''} ${
                index < count
                    ? 'bg-white opacity-80 border-r-2'
                    : index === count
                    ? 'loader-pulse'
                    : 'bg-slate-800 opacity-100'
            }`}
          ></div>
        )
    }
    
    return (
      <div className="w-[95%] flex justify-center border rounded-3xl h-[15px]">
        {Array(Number(blocksToAct))
            .fill(null)
            .map((_, index) => (
                <Segment key={index} index={index} />
            ))}
      </div>
    )

}

export default AcceptLoader;