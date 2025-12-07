import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from "../../api";

const initialState = {
    _id: null,
    title: null,
    description: null,
    language: null,
    imageURL: null,
    durationInMinutes: null,
    isLoading: false,
}

export const fetchMovie = createAsyncThunk(
    'movie/fetchMovie',
    async (movieId) => {
        try {
            const {data} = await apiInstance.get(`/api/movies/${movieId}`);
            const movie = data.data;
            return movie;
        } catch (error) {
            console.log('error', error);
        }
    }
);

const moveiSlice = createSlice({
    name:"movie",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMovie.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchMovie.fulfilled, (state, action) => {
            state._id = action.payload._id;
            state.isLoading = false;
            state.title = action.payload.title;
            state.description = action.payload.description;
            state.language = action.payload.language;
            state.imageURL = action.payload.imageURL;
            state.durationInMinutes = action.payload.durationInMinutes;
        });
    }
});

export default moveiSlice.reducer;