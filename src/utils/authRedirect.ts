import type { Location } from "react-router-dom";

export type LoginRedirectState = {
  from: Pick<Location, "pathname" | "search">;
};

export function reservarReturnTo(salaId?: number): LoginRedirectState["from"] {
  return salaId != null
    ? { pathname: "/reservar", search: `?salaId=${salaId}` }
    : { pathname: "/reservar", search: "" };
}

export function loginRedirectState(
  from: LoginRedirectState["from"]
): LoginRedirectState {
  return { from };
}
