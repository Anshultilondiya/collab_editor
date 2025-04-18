import {Routes, Route } from "react-router";
import { AuthPage } from "./pages/Auth";
import { DashboardPage } from "./pages/Dashboard";
import { EditorPage } from "./pages/Editor";
import { AuthenticationCheck } from "./AuthenticationCheck";


export const AppRouter = () => {
    return (
        <Routes>
            <Route path={"/"} element={< AuthenticationCheck />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path={"/editor/:documentId"} element={<EditorPage />} />
            </Route>
            <Route path="/login" element={<AuthPage />} />
        </Routes>
    )
}