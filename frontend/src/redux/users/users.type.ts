export type UserState = {
    isAuthenticated: boolean;
    user: Record<string, unknown> | null;
    userSession: Record<string, unknown> | null;
}