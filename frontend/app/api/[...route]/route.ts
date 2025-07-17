import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DATA_SERVER_BASE_URL } from "@/constants/globals";
import { HEADER, SESSION_COOKIE_NAME } from "@/constants/session";
import { setSessionCookie } from "@/lib/api/session";

// redirect API request to the data server with the session UUID in the header
async function middlewareHandler(
	req: NextRequest
): Promise<NextResponse<unknown>> {
	const route = req.nextUrl.pathname.replace(/^\/api/, "");
	const url = `${DATA_SERVER_BASE_URL}${route}${req.nextUrl.search}`;
	const sessionUuid = req.cookies.get(SESSION_COOKIE_NAME)?.value;
	const method = req.method;
	const headers = new Headers(req.headers);
	if (!headers.has("Origin")) {
		const host = req.headers.get("host");
		headers.set("Origin", `http://${host}`);
	}
	headers.set(HEADER.SESSION_UUID_KEY, sessionUuid || "");
	const init = {
		method,
		headers,
		body: method === "GET" || method === "DELETE" ? undefined : req.body,
		duplex: "half"
	} as RequestInit & { duplex: "half" };
	try {
		const goRes = await fetch(url, init);

		const response = new NextResponse(goRes.body, {
			status: goRes.status,
			headers: goRes.headers,
		});
		// set cookie
		const newSessionUuid = goRes.headers.get(HEADER.SET_SESSION_UUID_KEY);
		if (newSessionUuid !== null) {
			const expiresAt = goRes.headers.get(HEADER.SESSION_EXPIRES_KEY);
			setSessionCookie(response, newSessionUuid, expiresAt);
		}
		return response;
	} catch (e) {
		console.error(`Error while fetching data server: ${e}`);
		return new NextResponse(null);
	}
}

export async function GET(req: NextRequest) {
	return middlewareHandler(req);
}
export async function POST(req: NextRequest) {
	return middlewareHandler(req);
}
export async function PUT(req: NextRequest) {
	return middlewareHandler(req);
}
export async function DELETE(req: NextRequest) {
	return middlewareHandler(req);
}