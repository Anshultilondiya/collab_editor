export type UserState = {
    isAuthenticated: boolean;
    user: Record<string, any> | null;
    userSession: Record<string, any> | null;
    loading: boolean;
}