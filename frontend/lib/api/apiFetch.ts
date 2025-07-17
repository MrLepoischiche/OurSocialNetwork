import { API_BASE_URL, API_ROUTES } from "@/constants/apiRoutes";
import { fetchCore, FetchResponse } from "./fetch";

/**
 * @brief Fetch API using the apiRoutes (client side).
 */
export async function apiFetch<
	Key extends keyof typeof API_ROUTES,
	Route extends (typeof API_ROUTES)[Key],
	Req extends Route["request"],
	Res extends Route["response"]
>(
	key:    Key,
	params: Parameters<Route["path"]>,
	body:   Req
): Promise<FetchResponse<Res>> {
	const route = API_ROUTES[key];
	const options: RequestInit = {
		headers: {},
		credentials: "include"
	}
	return await fetchCore(route, API_BASE_URL, options, params, body);
}
