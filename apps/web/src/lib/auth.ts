import { genericOAuth, lastLoginMethod, oidcProvider } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth, type Account, type OAuth2Tokens, type OAuth2UserInfo } from "better-auth";


export const auth = betterAuth({
    secret: process.env.MYTPEN_AUTH_SECRET,
    // database: new Database("better-auth.db"),
    plugins: [
        genericOAuth({
            config: [{ 
                providerId: "test-app-local", 
                clientId: "VNfiJSgbhPmkYgpNmxzrLZHOXkmfBGXl",
                clientSecret: "istTbmZIaVLJcqYiylrxnrVclQDyzEFn",
                discoveryUrl: `${process.env.MYTPEN_AUTH_SERVER}/api/auth/.well-known/openid-configuration`,
                // discoveryUrl: "http://localhost:3000/api/auth/.well-known/openid-configuration",

            },
            { 
                providerId: "test-app", 
                clientId: "VfrolVsbmKCPhSYQgIgpEnmFakpmfGgk",
                clientSecret: "BxUtjGQkBfdxCWjlxGlNsiZoxOFzurPX", 
                discoveryUrl: `${process.env.MYTPEN_AUTH_SERVER}/api/auth/.well-known/openid-configuration`,
                // discoveryUrl: "http://localhost:3000/api/auth/.well-known/openid-configuration",
            },
            
        ],
            
        }),
        nextCookies(),
    ],

    databaseHooks: {
        user: {
            create: {
               async before(user) {
                    console.log("user", user);

                    if (user.sub) {
                        return {
                            data: {
                                ...user,
                                id: String(user.sub),
                            },
                        };
                    }
                    
                   
                    return {
                        data: {
                            ...user,
                        },
                    };
                   
                }
            }
        }
    }
});
