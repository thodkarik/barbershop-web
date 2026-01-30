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

export type RegisterRequest = {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    firstName: string;
    lastName: string;
};

export async function register(request: RegisterRequest): Promise<void> {
    await api.post("/auth/signup", {
        username: request.username,
        email: request.email,
        phoneNumber: request.phoneNumber,
        password: request.password,
        firstName: request.firstName,
        lastName: request.lastName,
    });
}

