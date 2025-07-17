import { APIRoute } from "@/constants/apiRoutes";
import { FILES_FORM_FILE_KEY, JSON_FORM_FILE_KEY } from "@/constants/globals";

interface HTTPErrorResponse {
	message: string;
};

export interface FetchResponse<T> {
	code:     number;
	ok:       boolean;
	errorMsg: string;
	data:     T | null;
}

export async function fetchCore<
	Req,
	Res
>(
	route:   APIRoute,
	baseUrl: string,
	options: RequestInit,
	params:  any[],
	body:    Req
): Promise<FetchResponse<Res>> {
	let response:     Response;
	let responseData: any;
	let url:          string;

	[url, options] = setRequestBasics(route, baseUrl, options, params, body);
	responseData = null;
	try {
		response = await fetch(url, options);
		const contentType = response.headers.get("content-type");
		if (contentType?.includes("application/json")) {
			responseData = await response.json();
		}
		return {
			code:     response.status,
			ok:       response.ok,
			errorMsg: response.ok || responseData === null ?
				"" : (responseData as HTTPErrorResponse).message,
			data:     response.ok && responseData !== null ?
				responseData as Res : null,
		}
	} catch (error) {
		console.error(`Error at api fetch: ${error}`);
		return {
			code:     500,
			ok:       false,
			errorMsg: `fetchAPI error: ${error}`,
			data:     null,
		}
	}
}

// return url and request options
export function setRequestBasics<
	Req,
>(
	route:   APIRoute,
	url:     string,
	options: RequestInit,
	params:  any[],
	body:    Req
): [string, RequestInit] {
	const method = route["method"] as APIRoute["method"];
	options.method = method;

	if (route.path.length > 0 && params.length > 0) {
		url += route.path(...params);
	} else {
		url += route.path();
	}
	if (body !== null && (method === "POST" || method === "PUT")) {
		if (body instanceof FormData) {
			options.body = body;
		} else if (isJsonWithFiles(body)) {
			let formData = new FormData();
			formData.append(JSON_FORM_FILE_KEY, JSON.stringify(body.json));
			if (body.files) {
				Array.from(body.files).forEach(f => {
					formData.append(FILES_FORM_FILE_KEY, f);
				})
			}
			options.body = formData;
		} else {
			options.body = JSON.stringify(body);
			let headers = (options.headers as Record<string, string>);
			headers["Content-Type"] = "application/json";
		}
	}
	return [url, options];
}

function isJsonWithFiles(value: any): value is JsonWithFiles<any> {
	return (
		typeof value === "object" &&
		value !== null &&
		"json" in value &&
		"files" in value &&
		(value.files === null || value.files instanceof FileList)
	);
}
