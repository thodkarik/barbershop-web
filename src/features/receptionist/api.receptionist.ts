import api from "../../shared/api/axios";

export type ReceptionistAppointmentDto = {
    appointmentId: number;
    start: string;
    end: string;
    status: string;
    barberName: string;
    customerName: string;
    customerPhone: string;
    serviceName: string;
};

export async function getReceptionistAppointments(): Promise<ReceptionistAppointmentDto[]> {
    const res = await api.get<ReceptionistAppointmentDto[]>("/receptionist/appointments");
    return res.data;
}

export type UpdateAppointmentStatusRequest = {
    status: "Completed" | "Canceled" | "NoShow";
};

export async function updateAppointmentStatus(id: number, req: UpdateAppointmentStatusRequest): Promise<void> {
    await api.put(`/receptionist/appointments/${id}/status`, req);
}