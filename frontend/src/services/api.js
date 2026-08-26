const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

async function apiCall(path, options = {}) {
    const token = localStorage.getItem('urbanpulse_access_token');
    const headers = { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    if (!res.ok) {
        let detail = 'خطا در ارتباط با سرور';
        try {
            const data = await res.json();
            detail = data.detail || Object.values(data)[0] || detail;
            if (Array.isArray(detail)) detail = detail[0];
        } catch (e) { /* ignore */ }
        throw new Error(detail);
    }
    if (res.status === 204) return null;
    return res.json();
}

// --- Auth ---
export const login = (username, password) => apiCall('/auth/token/', { method: 'POST', body: JSON.stringify({ username, password }) });
export const register = (data) => apiCall('/register/register/', { method: 'POST', body: JSON.stringify(data) });

// --- Requests (tickets) ---
export const getRequests = () => apiCall('/requests/');
export const getRequestByTrackingCode = (code) => apiCall(`/requests/?tracking_code=${encodeURIComponent(code)}`);
export const createRequest = (formData) => apiCall('/requests/', { method: 'POST', body: formData });
export const changeRequestStatus = (id, payload) => apiCall(`/requests/${id}/change_status/`, { method: 'POST', body: JSON.stringify(payload) });

// --- Citizens ---
export const getCitizens = () => apiCall('/citizens/');
export const toggleCitizenStatusApi = (phone) => apiCall('/citizens/toggle_status/', { method: 'POST', body: JSON.stringify({ phone }) });

// --- Contractors ---
export const getContractors = () => apiCall('/contractors/');
export const createContractorApi = (data) => apiCall('/contractors/', { method: 'POST', body: JSON.stringify(data) });
export const updateContractorApi = (data) => apiCall(`/contractors/${data.id}/`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteContractorApi = (id) => apiCall(`/contractors/${id}/`, { method: 'DELETE' });
