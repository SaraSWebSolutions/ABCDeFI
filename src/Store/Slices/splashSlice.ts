import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../../Services/authService";

interface SplashState {
  loading: boolean;
  data: any;
  error: string | null;
}

const initialState: SplashState = {
  loading: false,
  data: null,
  error: null,
};

export const fetchSplash = createAsyncThunk(
  "splash/fetchSplash",
  async (_, thunkAPI) => {
    try {
      const response = await AuthService.splashScreen();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "API Error");
    }
  }
);

const splashSlice = createSlice({
  name: "splash",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSplash.pending, state => {
        state.loading = true;
      })
      .addCase(fetchSplash.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSplash.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default splashSlice.reducer;