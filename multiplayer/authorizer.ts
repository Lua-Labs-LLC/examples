import { Resource } from "sst";
import { realtime } from "sst/aws/realtime";
import { lucia } from "./auth/lucia";

export const handler = realtime.authorizer(async (token) => {
  const prefix = `${Resource.App.name}/${Resource.App.stage}`;
  return {
    subscribe: [`${prefix}/*`],
  };
  try {
    if (!token) {
      throw new Error("No token provided");
    }
    const result = await lucia.validateSession(token);

    if (!result.session || !result.session.fresh) {
      throw new Error("Invalid or stale session");
    }
    console.log(result);
    return {
      publish: [`${prefix}/*`],
      subscribe: [`${prefix}/*`],
    };
  } catch {
    return {
      publish: [],
      subscribe: [],
    };
  }
});
