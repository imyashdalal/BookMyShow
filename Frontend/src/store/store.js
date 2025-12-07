import { configureStore } from '@reduxjs/toolkit';

import movieReducer from './slices/movieSlice';
import hallReducer from './slices/hallSlice';
import bookingReducer from './slices/bookingSlice';
import locationReducer from './slices/locationSlice';

export const store = configureStore({
    reducer: {
        movie: movieReducer,
        hall: hallReducer,
        booking: bookingReducer,
        location: locationReducer,
    },
    devTools: true,
})