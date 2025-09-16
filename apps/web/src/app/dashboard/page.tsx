"use client";

import { useEffect, useState, useTransition } from "react";
import { signIn, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
	// Get the session data using the useSession hook
	const { data: session, isPending, error } = authClient.useSession();
	const handleClick = async (providerId: string) => {
		const { data, error } = await authClient.signIn.oauth2({
			providerId: providerId, // required
			callbackURL: "/dashboard",
			errorCallbackURL: "/error-page",
			newUserCallbackURL: "/dashboard",
			scopes: ["openid", "profile", "email"],
			// disableRedirect: false,
			// scopes: ["my-scope"],
			// requestSignUp: false,
		});

		console.log(data, error);
	};


	useEffect(()=>{

		const isAuthenticated = async () => {
			const tokens = await authClient.getAccessToken({
				providerId: process.env.NEXT_PUBLIC_MYTPEN_AUTH_PROVIDERID!
			})
		
		
			console.log(tokens)
		}
	
	
		isAuthenticated()

	}, [])

	return (
		<div className="container mx-auto py-10 space-y-8">
			<h1 className="text-2xl font-bold text-center">
				Client Authentication Test
			</h1>

			<div className="grid grid-cols-1 gap-8">

				{/* Session Display */}
				<Card>
					<CardHeader>
						<CardTitle>Session Information</CardTitle>
						<CardDescription>
							{isPending
								? "Loading session..."
								: session
									? "You are currently logged in"
									: "You are not logged in"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isPending ? (
							<div className="flex justify-center py-4">
								<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
							</div>
						) : error ? (
							<div className="p-4 bg-destructive/10 text-destructive rounded-md">
								Error: {error.message}
							</div>
						) : session ? (
							<div className="space-y-4">
								<div className="flex items-center gap-4">
									{session.user.image ? (
										<img
											src={session.user.image}
											alt="Profile"
											className="h-12 w-12 rounded-full object-cover"
										/>
									) : (
										<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
											<span className="text-lg font-medium">
												{session.user.name?.charAt(0) ||
													session.user.email?.charAt(0)}
											</span>
										</div>
									)}
									<div>
										<p className="font-medium">{session.user.name}</p>
										<p className="text-sm text-muted-foreground">
											{session.user.email}
										</p>
									</div>
								</div>

								<div className="rounded-md bg-muted p-4">
									<p className="text-sm font-medium mb-2">Session Details:</p>
									<pre className="text-xs overflow-auto max-h-40">
										{JSON.stringify(session, null, 2)}
									</pre>
								</div>
							</div>
						) : (
							<div className="py-8 text-center text-muted-foreground">
								<p>Sign in to view your session information</p>
								<Button variant="outline" className="w-full mt-4"  onClick={() => handleClick("test-app-local")}>Sign In Local</Button>
								<Button variant="outline" className="w-full mt-4"  onClick={() => handleClick("test-app")}>Sign In Remote</Button>
							</div>
						)}
					</CardContent>
					{session && (
						<CardFooter>
							<Button
								variant="outline"
								className="w-full"
								onClick={() =>
									authClient.signOut({
										fetchOptions: {
											onSuccess: () => {
												toast.success("Successfully signed out!");
											},
										},
									})
								}
							>
								Sign Out
							</Button>
						</CardFooter>
					)}
				</Card>
			</div>
		</div>
	);
}
