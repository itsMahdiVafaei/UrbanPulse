import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequests, createRequest, changeRequestStatus } from '../../services/api';

export const fetchTickets = createAsyncThunk('tickets/fetch', async () => await getRequests());
export const addTicketThunk = createAsyncThunk('tickets/create', async (formData) => await createRequest(formData));
export const updateTicketStatus = createAsyncThunk('tickets/updateStatus', async ({ id, newStatus, adminComment, assignedTo }) => {
    return await changeRequestStatus(id, { newStatus, adminComment, assignedTo });
});

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: { list: [], loading: false, error: null },
    reducers: {
        syncTickets: () => {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchTickets.fulfilled, (state, action) => { state.list = action.payload; state.loading = false; })
            .addCase(fetchTickets.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
            .addCase(addTicketThunk.fulfilled, (state, action) => { state.list.unshift(action.payload); })
            .addCase(updateTicketStatus.fulfilled, (state, action) => {
                const idx = state.list.findIndex(t => t.id === action.payload.id);
                if (idx !== -1) state.list[idx] = action.payload;
            });
    }
});

export const { syncTickets } = ticketSlice.actions;
export default ticketSlice.reducer;
