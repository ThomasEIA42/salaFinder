import type { Location } from "react-router-dom";

export type LoginRedirectState = {
  from: Pick<Location, "pathname" | "search">;
};

export function reservarReturnTo(spaceId?: string): LoginRedirectState["from"] {
  return spaceId != null
    ? { pathname: "/reservar", search: `?spaceId=${spaceId}` }
    : { pathname: "/reservar", search: "" };
}

export function loginRedirectState(
  from: LoginRedirectState["from"]
): LoginRedirectState {
  return { from };
}
