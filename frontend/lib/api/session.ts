import { SESSION_COOKIE_NAME } from "@/constants/session";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";

export async function setSessionCookie(
	response:    NextResponse<unknown>,
	sessionUuid: string,
	expiresAt:   string | null,
) {
	const cookie: ResponseCookie = {
		name:     SESSION_COOKIE_NAME,
		value:    sessionUuid,
		httpOnly: true,
		secure:   process.env.NODE_ENV === "production",
		path:     "/",
		sameSite: "lax",
	};
	if (sessionUuid === "") {
		cookie.maxAge = -1 // delete cookie if sessionUuid is empty
	} else if (expiresAt) {
		cookie.expires = new Date(expiresAt);
	}
	response.cookies.set(cookie);
}
