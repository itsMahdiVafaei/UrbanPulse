import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ticketsReducer from '../features/tickets/ticketSlice';
import adminReducer from '../features/admin/adminSlice'; // ۱. حتما وارد شود

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tickets: ticketsReducer,
        admin: adminReducer, // ۲. نام این کلید باید دقیقا admin باشد
    },
});