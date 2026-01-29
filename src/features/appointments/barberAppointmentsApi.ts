import api from "../../shared/api/axios";

export type BarberAppointmentDto = {
    id: number;
    appointmentDateTime: string;
    status: string;
    serviceName: string;
    customerName: string;
};

export async function getBarberAppointments(): Promise<BarberAppointmentDto[]> {
    const res = await api.get<BarberAppointmentDto[]>("/Barbers/appointments");
    return res.data;
}