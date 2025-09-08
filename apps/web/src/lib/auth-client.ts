import { createAuthClient } from "better-auth/react";

import {
    inferAdditionalFields,
    genericOAuthClient,
    oidcClient,
    lastLoginMethodClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3001",
    plugins: [
        genericOAuthClient(),
    ],
});

export const { signIn, signUp, useSession } = authClient;
