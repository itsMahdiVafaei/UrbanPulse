import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCitizens, toggleCitizenStatusApi, getContractors, createContractorApi, updateContractorApi, deleteContractorApi } from '../../services/api';

export const fetchCitizens = createAsyncThunk('admin/fetchCitizens', async () => await getCitizens());
export const fetchContractors = createAsyncThunk('admin/fetchContractors', async () => await getContractors());
export const toggleCitizenStatus = createAsyncThunk('admin/toggleCitizenStatus', async (phone) => await toggleCitizenStatusApi(phone));
export const addContractor = createAsyncThunk('admin/addContractor', async (data) => await createContractorApi(data));
export const updateContractor = createAsyncThunk('admin/updateContractor', async (data) => await updateContractorApi(data));
export const deleteContractor = createAsyncThunk('admin/deleteContractor', async (id) => { await deleteContractorApi(id); return id; });

const adminSlice = createSlice({
    name: 'admin',
    initialState: { contractors: [], citizens: [] },
    reducers: {
        addCitizen: (state, action) => { state.citizens.unshift(action.payload); },
        updateCitizenProfile: (state, action) => {
            const index = state.citizens.findIndex(c => c.phone === action.payload.phone);
            if (index !== -1) state.citizens[index] = { ...state.citizens[index], ...action.payload };
        },
        syncAdminData: () => {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCitizens.fulfilled, (state, action) => { state.citizens = action.payload; })
            .addCase(fetchContractors.fulfilled, (state, action) => { state.contractors = action.payload; })
            .addCase(toggleCitizenStatus.fulfilled, (state, action) => {
                const i = state.citizens.findIndex(c => c.phone === action.payload.phone);
                if (i !== -1) state.citizens[i] = action.payload;
            })
            .addCase(addContractor.fulfilled, (state, action) => { state.contractors.unshift(action.payload); })
            .addCase(updateContractor.fulfilled, (state, action) => {
                const i = state.contractors.findIndex(c => c.id === action.payload.id);
                if (i !== -1) state.contractors[i] = action.payload;
            })
            .addCase(deleteContractor.fulfilled, (state, action) => {
                state.contractors = state.contractors.filter(c => c.id !== action.payload);
            });
    }
});

export const { addCitizen, updateCitizenProfile, syncAdminData } = adminSlice.actions;
export default adminSlice.reducer;
