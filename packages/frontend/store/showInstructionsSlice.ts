import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InstructionsState {
    currentStep: number;
    isOpen:boolean;
}

const getInitialIsOpenState = (): boolean => {
    const cachedIsOpen = localStorage.getItem('isInstructionOpen');
    return cachedIsOpen !== 'false';
};

const initialState: InstructionsState = {
    currentStep: 0,
    isOpen:  getInitialIsOpenState(),
};

const showInstructionsSlice = createSlice({
    name: 'showInstructions',
    initialState,
    reducers: {
        setCurrentStep(state, action: PayloadAction<number>) {
            state.currentStep = action.payload;
        },
        setIsOpen(state, action: PayloadAction<boolean>) {
            if(action.payload === true) {
                state.currentStep = 0;
            }
            state.isOpen = action.payload;
            if (action.payload === false) {
                localStorage.setItem('isInstructionOpen', 'false');
            } else {
                localStorage.setItem('isInstructionOpen', 'true');
            }
        },
    },
});

export const { setCurrentStep, setIsOpen } = showInstructionsSlice.actions;
export default showInstructionsSlice.reducer;