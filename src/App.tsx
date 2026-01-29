import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./shared/components/Layout";
import { AuthProvider } from "./features/auth/AuthContext";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ServicesPage from "./features/services/ServicesPage";
import BookAppointmentPage from "./features/appointments/BookAppointmentPage";
import MyAppointmentsPage from "./features/appointments/MyAppointmentsPage";
import BarberAppointmentsPage from "./features/appointments/BarberAppointmentsPage.tsx";
import ReceptionistAppointmentsPage from "./features/receptionist/ReceptionistAppointmentsPage.tsx";
import AdminServicesPage from "./features/services/AdminServicesPage.tsx";
import RoleRoute from "./features/auth/RoleRoute.tsx";

function App() {
    return (
        <>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Layout />}>

                            {/* Public */}
                            <Route index element={<ServicesPage />} />
                            <Route path="login" element={<LoginPage />} />
                            <Route path="register" element={<RegisterPage />} />

                            {/* Customer */}
                            <Route
                                path="appointments"
                                element={<RoleRoute allowed={["Customer", "Admin"]} />}
                            >
                                <Route path="book" element={<BookAppointmentPage />} />
                                <Route path="me" element={<MyAppointmentsPage />} />
                            </Route>

                            {/* Barber */}
                            <Route
                                path="barber"
                                element={<RoleRoute allowed={["Barber", "Admin"]} />}
                            >
                                <Route path="appointments" element={<BarberAppointmentsPage />} />
                            </Route>

                            {/* Receptionist */}
                            <Route
                                path="receptionist"
                                element={<RoleRoute allowed={["Receptionist", "Admin"]} />}
                            >
                                <Route path="appointments" element={<ReceptionistAppointmentsPage />} />
                            </Route>

                            {/* Admin */}
                            <Route
                                path="admin"
                                element={<RoleRoute allowed={["Admin"]} />}
                            >
                                <Route path="services" element={<AdminServicesPage />} />
                            </Route>

                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </>
    );
}

export default App;

