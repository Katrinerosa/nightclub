"use client";

import { useEffect, useState } from "react";
import { hasCookieConsent } from "../actions";
import CookieBanner from "../cookie-banner";

export default function BannerController() {
	const [show, setShow] = useState<boolean>(false);

	useEffect(function () {
		hasCookieConsent()
			.then(data => setShow(data));
	}, []);

	return <CookieBanner showBanner={show} />;
}