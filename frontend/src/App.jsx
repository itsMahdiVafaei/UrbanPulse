import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import LoginPage from './features/auth/LoginPage';
import CitizenDashboard from './features/tickets/CitizenDashboard';
import AdminDashboard from './features/admin/AdminDashboard';
import ContractorDashboard from './features/contractor/ContractorDashboard';

import { fetchTickets } from './features/tickets/ticketSlice';
import { fetchCitizens, fetchContractors } from './features/admin/adminSlice';

function App() {
    const dispatch = useDispatch();
    const { isAuthenticated, role } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) return;
        dispatch(fetchTickets());
        if (role === 'operator' || role === 'admin') {
            dispatch(fetchCitizens());
            dispatch(fetchContractors());
        }
    }, [isAuthenticated, role, dispatch]);

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            role === 'citizen' ? <CitizenDashboard /> :
                                role === 'operator' || role === 'admin' ? <AdminDashboard /> :
                                    <ContractorDashboard />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
