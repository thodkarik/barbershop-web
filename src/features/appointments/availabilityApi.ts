import api from "../../shared/api/axios";

export type AvailabilitySlotDto = {
    start: string; // ISO datetime
    end: string;   // ISO datetime
};

export async function getAvailability(params: {
    date: string; // YYYY-MM-DD
    barberId: number;
    serviceId: number;
}): Promise<AvailabilitySlotDto[]> {
    const res = await api.get<AvailabilitySlotDto[]>("/Appointments/availability", {
        params,
    });
    return res.data;
}
