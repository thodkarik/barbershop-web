import api from "../../shared/api/axios";

export type BarberDto = {
    id: number;
    fullName: string;
};

export async function getBarbers(): Promise<BarberDto[]> {
    const res = await api.get<BarberDto[]>("/Barbers");
    return res.data;
}
