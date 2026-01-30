import api from "../../shared/api/axios";

export type ServiceDto = {
    id: number;
    name: string;
    description: string;
    durationMinutes: number;
    price: number;
};

export async function getServices(): Promise<ServiceDto[]> {
    const response = await api.get<ServiceDto[]>("/services");
    return response.data;
}
