import { createAuthClient } from "better-auth/react";

import {
    inferAdditionalFields,
    genericOAuthClient,
    oidcClient,
    lastLoginMethodClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.MYTPEN_AUTH_CLIENT,
    plugins: [
        genericOAuthClient(),
    ],
});

export const { signIn, signUp, useSession } = authClient;
