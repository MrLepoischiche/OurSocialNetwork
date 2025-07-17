import { PingResponse } from "@/types/api/endpoints/ping";
import { WEBSITE_BASE_URL } from "./globals";
import { LoginRequest, LoginResponse, LogoutResponse } from "@/types/api/endpoints/auth";
import { CompanyData } from "@/types/api/endpoints/companies";
import { StudentData } from "@/types/api/endpoints/students";

export const API_BASE_URL = `${WEBSITE_BASE_URL}/api`;

export interface APIRoute {
	path:     (...args: any[]) => string;
	method:   "GET" | "POST" | "PUT" | "DELETE";
	request:  any;
	response: any;
}

export const API_ROUTES = {
	ping: {
		path: (message: string) => (
			`/ping/${message}`
		),
		method: "GET",
		request: null,
		response: {} as PingResponse
	},
	login: {
		path: () => (
			`/users/login`
		),
		method: "POST",
		request:  {} as LoginRequest,
		response: {} as LoginResponse
	},
	logout: {
		path:     () => (
			"/users/me/session"
		),
		method:   "DELETE",
		request:  null,
		response: {} as LogoutResponse
	},
	verifySession: {
		path:     () => (
			"/users/me/session/status"
		),
		method:   "GET",
		request:  null,
		response: null
	},


	// COMPANIES
	getCompanies: {
		path:     (page: number, limit: number) => (
			`/companies?page${page}&${limit}`
		),
		method:   "GET",
		request:  null,
		response: [] as CompanyData[]
	},


	// STUDENTS
	getStudents: {
		path:     (page: number, limit: number) => (
			`/students?page${page}&${limit}`
		),
		method:   "GET",
		request:  null,
		response: [] as StudentData[]
	},
} satisfies Record<string, APIRoute>
