import { genericOAuth, lastLoginMethod, oidcProvider } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth, type Account, type OAuth2Tokens, type OAuth2UserInfo } from "better-auth";

async function fetchUserInfoFromCustomProvider(accessToken: string) {
    const response = await fetch(`${process.env.MYTPEN_AUTH_SERVER}/api/auth/oauth2/userinfo`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const userInfo = await response.json();

      return userInfo;
}

export const auth = betterAuth({
    secret: process.env.MYTPEN_AUTH_SECRET,

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
    // database: new Database("better-auth.db"),
    plugins: [
        genericOAuth({
            config: [{ 
                providerId: "test-app", 
                clientId: "VfrolVsbmKCPhSYQgIgpEnmFakpmfGgk",
                clientSecret: "BxUtjGQkBfdxCWjlxGlNsiZoxOFzurPX", 
                discoveryUrl: `${process.env.MYTPEN_AUTH_SERVER}/api/auth/.well-known/openid-configuration`,
                // discoveryUrl: "http://localhost:3000/api/auth/.well-known/openid-configuration",

                getUserInfo: async (tokens) => {

                    console.log("tokens", tokens);                // Custom logic to fetch and return user info
                    const userInfo = await fetchUserInfoFromCustomProvider(tokens.accessToken || "");
                    console.log("userInfo", userInfo);
                    return {
                     ...userInfo,
                     accessToken: tokens.accessToken,
                    };
                  }
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
