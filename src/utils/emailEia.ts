export const EIA_EMAIL_DOMAIN = "eia.edu.co";

export const EIA_EMAIL_ERROR =
  "Debes registrarte con un correo institucional @eia.edu.co";

export function isEmailEia(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at <= 0) return false;
  const domain = normalized.slice(at + 1);
  return domain === EIA_EMAIL_DOMAIN;
}
