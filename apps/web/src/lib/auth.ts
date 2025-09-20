import { genericOAuth, lastLoginMethod, oidcProvider } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth, type Account, type OAuth2Tokens, type OAuth2UserInfo } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { decodeJwt } from "jose";


export const auth = betterAuth({
    secret: process.env.MYTPEN_AUTH_SECRET,
    // database: new Database("better-auth.db"),
    user: {
        additionalFields: {
            accessToken: {
            type: "string",
            required: false,
            defaultValue: "",
            input: false, // don't allow user to set role
          },
        },
      },

    session: {
        additionalFields: {
            accessToken: {
            type: "string",
            required: false,
            defaultValue: "",
            input: false, // don't allow user to set role
          },
        },
      },
    plugins: [
        genericOAuth({
            config: [{ 
                providerId: "test-app-local", 
                clientId: "VNfiJSgbhPmkYgpNmxzrLZHOXkmfBGXl",
                clientSecret: "istTbmZIaVLJcqYiylrxnrVclQDyzEFn",
                discoveryUrl: `${process.env.MYTPEN_AUTH_SERVER}/api/auth/.well-known/openid-configuration`,
                // discoveryUrl: "http://localhost:3000/api/auth/.well-known/openid-configuration",
                getUserInfo: async (tokens) => {
                    // Custom logic to fetch and return user info

                    if (tokens.idToken) {
                        const decoded = decodeJwt(tokens.idToken) as {
                            sub: string;
                            email_verified: boolean;
                            email: string;
                            name: string;
                            picture: string;
                        };
                        if (decoded) {
                            // console.log(decoded)
                            if (decoded.sub && decoded.email) {
                                return {
                                    id: decoded.sub,
                                    emailVerified: decoded.email_verified,
                                    image: decoded.picture,
                                    accessToken: tokens.accessToken,
                                    ...decoded,
                                };
                            }
                        }
                    }
                   return null
                  },
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
    },

    hooks: {
        after: createAuthMiddleware(async (ctx) => {
           
            if (ctx.path == "/get-session") {
               const session = ctx.context.session

               if(session){
                session.session.accessToken = session.user.accessToken
                // delete session.user.accessToken
               }
            }

        }),
    },
});
