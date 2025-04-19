import { Box } from "@mui/material"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router"
import { NavigationBar } from "./components/NavigationBar"
import type { TRootState } from "./redux/store"

export const AuthenticationCheck = () => {

    const { isAuthenticated, userSession } = useSelector((state: TRootState) => state.user)
    useEffect(() => {
        if (isAuthenticated) {
            console.log("User is authenticated", userSession)
        } else {
            console.log("User is not authenticated")
        }
    }
    , [isAuthenticated, userSession])

    return (
        isAuthenticated ? (
            <Box className={"layout"}>
            <NavigationBar/>
            <Outlet/>
            </Box>
        ): <Navigate to="/login" replace />
    )
}