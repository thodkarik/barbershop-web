import api from "../../shared/api/axios";
import type { ServiceDto } from "./servicesApi";

export type UpsertServiceRequest = {
    name: string;
    description: string;
    durationMinutes: number;
    price: number;
};

export async function createService(req: UpsertServiceRequest): Promise<ServiceDto> {
    const res = await api.post<ServiceDto>("/Services", req);
    return res.data;
}

export async function updateService(id: number, req: UpsertServiceRequest): Promise<void> {
    await api.put(`/Services/${id}`, req);
}

export async function deleteService(id: number): Promise<void> {
    await api.delete(`/Services/${id}`);
}
