import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./shared/components/Layout";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import { AuthProvider } from "./features/auth/AuthContext";

import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ServicesPage from "./features/services/ServicesPage";
import BookAppointmentPage from "./features/appointments/BookAppointmentPage";
import MyAppointmentsPage from "./features/appointments/MyAppointmentsPage";
import BarberAppointmentsPage from "./features/appointments/BarberAppointmentsPage.tsx";

function App() {
    return (
        <>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route index element={<ServicesPage />} />
                            <Route path="login" element={<LoginPage />} />
                            <Route path="register" element={<RegisterPage />} />
                            <Route path="barber" element={<ProtectedRoute />}>
                                <Route path="appointments" element={<BarberAppointmentsPage />} />
                            </Route>

                            <Route path="appointments" element={<ProtectedRoute />}>
                                <Route path="book" element={<BookAppointmentPage />} />
                                <Route path="me" element={<MyAppointmentsPage />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </>
    );
}

export default App;

