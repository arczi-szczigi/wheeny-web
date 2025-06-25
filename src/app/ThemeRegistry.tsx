"use client";

import React from "react";
import { StyleSheetManager } from "styled-components";

export default function ThemeRegistry({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<StyleSheetManager shouldForwardProp={() => true}>
			{children}
		</StyleSheetManager>
	);
}
