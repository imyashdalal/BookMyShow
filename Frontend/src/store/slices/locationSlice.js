import { createSlice} from '@reduxjs/toolkit';

const initialState = {
    location: null,
    custome: false,
}

const locationSlice = createSlice({
    name:"location",
    initialState,
    reducers: {
        setLocation: (state, action) => {
                state.location = action.payload.location;
                state.custome = false;
        },
        setCustomeLocation: (state, action) => {
            state.custome = true;
            state.location = action.payload.location;
        },
    },
});

export const { setLocation, setCustomeLocation } = locationSlice.actions;

export default locationSlice.reducer;