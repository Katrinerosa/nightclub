import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
	const cookies = request.cookies;

	if (!cookies.has("FD_AUTH_TOKEN"))
		return NextResponse.redirect(new URL("/login?message=Du skal være logget ind for at se instrumentbrættet", request.url));
}

export const config = {
	matcher: ["/dashboard/:path*", "/my-comments/:path*", "/my-bookings/:path*"]
};
