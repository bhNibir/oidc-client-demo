"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";



export default function Home() {
	const handleClick = async () => {
		const { data, error } = await authClient.signIn.oauth2({
			providerId: "test-app", // required
			callbackURL: "/dashboard",
			errorCallbackURL: "/error-page",
			newUserCallbackURL: "/welcome",
			scopes: ["openid", "profile", "email"],
			// disableRedirect: false,
			// scopes: ["my-scope"],
			// requestSignUp: false,
		});

		console.log(data, error);
	};
	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
		<div className="grid gap-6">
				<section className="rounded-lg border p-4">
					<h2 className="mb-2 font-medium">API Status</h2>
				</section>
			</div>

			<Button onClick={handleClick}>Click me</Button>
		</div>
	);
}
