import { createSlice} from '@reduxjs/toolkit';

const initialState = {
    showId: null,
    price: null,
    seatNumber: null,
    showDate: null,
    showTiming: null,
    theatreName: null,
}

const hallSlice = createSlice({
    name:"hall",
    initialState,
    reducers: {
        setShowDetails: (state, action) => {
            state.showId = action.payload.showId;
            state.price = action.payload.price;
            state.seatNumber = action.payload.seatNumber;
            state.showDate = action.payload.showDate;
            state.showTiming = action.payload.showTiming;
            state.theatreName = action.payload.theatreName;
        },
    },
});

export const { setShowDetails } = hallSlice.actions;

export default hallSlice.reducer;