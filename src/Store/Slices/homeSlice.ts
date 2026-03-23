import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../../Services/authService";

// 🔥 API CALL
export const fetchTimerIco = createAsyncThunk(
  "home/fetchTimerIco",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.timerIco();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Something went wrong");
    }
  }
);

//reward
export const fetchReward = createAsyncThunk(
  "home/fetchReward",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await AuthService.reward(data)

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Something went wrong");
    }
  }
);

// homeSlice.ts / homeSlice.js

export const fetchRewardStatus = createAsyncThunk(
  "home/fetchRewardStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.rewardStatus();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data || "Failed to fetch reward status"
      );
    }
  }
);

// 🧠 SLICE
const homeSlice = createSlice({
  name: "home",
  initialState: {
    timerIcoData: null,
    loading: false,
    error: null,
    rewardData: null,
     rewardStatus: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // ⏳ LOADING
      .addCase(fetchTimerIco.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // SUCCESS
      .addCase(fetchTimerIco.fulfilled, (state, action) => {
        state.loading = false;
        state.timerIcoData = action.payload;
      })

      // ERROR
      .addCase(fetchTimerIco.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchReward.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReward.fulfilled, (state, action) => {
         state.loading = false;
  state.rewardData = action.payload;

  state.rewardStatus = true;
      })
      .addCase(fetchReward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ REWARD STATUS
      .addCase(fetchRewardStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRewardStatus.fulfilled, (state, action) => {
        console.log(action.payload,"action.payload");
        
        state.loading = false;
        state.rewardStatus = action.payload;
      })
      .addCase(fetchRewardStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      
  },
});

export default homeSlice.reducer;