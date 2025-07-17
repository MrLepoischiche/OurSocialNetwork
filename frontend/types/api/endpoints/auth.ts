export interface LoginRequest {
	auth:     string;
	password: string;
}

export interface LoginResponse {
	message: string;
}

export interface LogoutResponse {
	message: string;
}
