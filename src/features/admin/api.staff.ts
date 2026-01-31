import api from "../../shared/api/axios";
import type { StaffListItem } from "../../shared/types/staff";

export async function getBarbers(): Promise<StaffListItem[]> {
    const res = await api.get<StaffListItem[]>("/Barbers");
    return res.data;
}

export async function getReceptionists(): Promise<StaffListItem[]> {
    const res = await api.get<StaffListItem[]>("/Receptionists");
    return res.data;
}