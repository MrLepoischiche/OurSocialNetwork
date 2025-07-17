export const SESSION_COOKIE_NAME = "session_uuid";

export const HEADER = {
	SESSION_UUID_KEY:     "X-Session-Uuid", // communicate session uuid to the server
	SET_SESSION_UUID_KEY: "X-Set-Session-Uuid", // received to set session
	SESSION_EXPIRES_KEY:  "X-Session-Expires", // received expires time
}
