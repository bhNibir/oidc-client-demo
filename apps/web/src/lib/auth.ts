import { genericOAuth, lastLoginMethod, oidcProvider } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth, type Account, type OAuth2Tokens, type OAuth2UserInfo } from "better-auth";
import { jwt } from "better-auth/plugins";

async function fetchUserInfoFromCustomProvider(tokens: OAuth2Tokens) {
    const response = await fetch('https://oidc-server-demo.vercel.app/api/auth/oauth2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`
        }
      });
      const userInfo = await response.json();

      return userInfo;
}

export const auth = betterAuth({
    // database: new Database("better-auth.db"),
    plugins: [
        genericOAuth({
            config: [{ 
                providerId: "test-app", 
                clientId: "VfrolVsbmKCPhSYQgIgpEnmFakpmfGgk",
                clientSecret: "BxUtjGQkBfdxCWjlxGlNsiZoxOFzurPX", 
                discoveryUrl: "https://oidc-server-demo.vercel.app/api/auth/.well-known/openid-configuration",
                // discoveryUrl: "http://localhost:3000/api/auth/.well-known/openid-configuration",

                getUserInfo: async (tokens) => {

                    console.log("tokens", tokens);                // Custom logic to fetch and return user info
                    const userInfo = await fetchUserInfoFromCustomProvider(tokens);
                    console.log("userInfo", userInfo);
                    return {
                     ...userInfo,
                     token: tokens.accessToken,
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
