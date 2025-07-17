import { API_BASE_URL, API_ROUTES } from "@/constants/apiRoutes";
import { FetchResponse, fetchCore } from "./fetch";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/constants/session";


/**
 * @brief Fetch API using the apiRoutes (server side).
 */
export async function apiServerFetch<
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
	const cookieStore = await cookies();
	const sessionUuid = cookieStore.get(SESSION_COOKIE_NAME);
	let options: RequestInit = {
		headers: {}
	};
	if (sessionUuid) {
		let headers = (options.headers as Record<string, string>);
		headers["Cookie"] = `${sessionUuid.name}=${sessionUuid.value}`;
	}
	return await fetchCore(route, API_BASE_URL, options, params, body);
}
