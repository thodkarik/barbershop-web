import api from "../../shared/api/axios";

export type CreateAppointmentRequest = {
    barberId: number;
    serviceId: number;
    appointmentDateTime: string;
};

export async function createAppointment(req: CreateAppointmentRequest): Promise<void> {
    await api.post("/Appointments", req);
}

export type MyAppointmentDto = {
    id: number;
    appointmentDateTime: string;
    status: string;
    barberName: string;
    serviceName: string;
};

export async function getMyAppointments(): Promise<MyAppointmentDto[]> {
    const res = await api.get<MyAppointmentDto[]>("/Appointments/me");
    return res.data;
}


