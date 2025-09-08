import Database from "better-sqlite3";
import { genericOAuth, lastLoginMethod, oidcProvider } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
    database: new Database("better-auth.db"),
    plugins: [
        genericOAuth({
            config: [{ 
                providerId: "test-app", 
                clientId: "VfrolVsbmKCPhSYQgIgpEnmFakpmfGgk",
                clientSecret: "BxUtjGQkBfdxCWjlxGlNsiZoxOFzurPX", 
                discoveryUrl: "https://oidc-server-demo.vercel.app/api/auth/.well-known/openid-configuration",}],
        }),
        nextCookies(),
    ],
});
