import type { TRootState } from "./redux/store"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router"
import { NavigationBar } from "./components/NavigationBar"
import { Box } from "@mui/material"

export const AuthenticationCheck = () => {

    const {isAuthenticated} = useSelector((state: TRootState) => state.user)

    return (
        isAuthenticated ? (
            <Box className={"layout"}>
            <NavigationBar/>
            <Outlet/>
            </Box>
        ): <Navigate to="/login" replace />
    )
}