import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const loadAuth = () => {
    const saved = localStorage.getItem('urban_pulse_auth');
    return saved ? JSON.parse(saved) : { user: null, role: null, isAuthenticated: false };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: loadAuth(),
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.isAuthenticated = true;
            localStorage.setItem('urban_pulse_auth', JSON.stringify(state));
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.isAuthenticated = false;
            localStorage.removeItem('urban_pulse_auth');
            localStorage.removeItem('urbanpulse_access_token');
            localStorage.removeItem('urbanpulse_refresh_token');
        },
        updateUserProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('urban_pulse_auth', JSON.stringify(state));
        }
    },
});

export const { loginSuccess, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
