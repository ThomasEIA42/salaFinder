export { FakeApi, fakeApi, type AuthUser } from "./FakeApi";
export * from "./data";

/**
 * Fake API (centralizada en una sola clase)
 */

import { fakeApi } from "./FakeApi";

// Wrappers por compatibilidad con imports existentes
export const login = (...args: Parameters<typeof fakeApi.login>) => fakeApi.login(...args);
export const logout = () => fakeApi.logout();
export const getCurrentUser = () => fakeApi.getCurrentUser();

export const obtenerSalas = () => fakeApi.obtenerSalas();
export const obtenerSalaPorId = (id: number) => fakeApi.obtenerSalaPorId(id);

export const getAuditLogs = () => fakeApi.getAuditLogs();
export const getAuditLogById = (id: number) => fakeApi.getAuditLogById(id);

export { MOCK_USERS, MOCK_POSTS, delay } from "./data";
