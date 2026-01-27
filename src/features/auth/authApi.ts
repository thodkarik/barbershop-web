import api from "../../shared/api/axios";

export type LoginRequest = {
    username: string;
    password: string;
};

export type LoginResponse = {
    token: string;
};

export async function login(request: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", request);
    return response.data;
}

