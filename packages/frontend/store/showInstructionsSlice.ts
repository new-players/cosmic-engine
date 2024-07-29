import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InstructionsState {
    currentStep: number;
    isOpen:boolean;
}

const initialState: InstructionsState = {
    currentStep: 0,
    isOpen: true,
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
        },
    },
});

export const { setCurrentStep, setIsOpen } = showInstructionsSlice.actions;
export default showInstructionsSlice.reducer;