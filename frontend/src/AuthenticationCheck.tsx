import { Box } from "@mui/material"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router"
import { NavigationBar } from "./components/NavigationBar"
import type { TRootState } from "./redux/store"

export const AuthenticationCheck = () => {

    const { isAuthenticated, userSession, loading } = useSelector((state: TRootState) => state.user)
    useEffect(() => {
        if (isAuthenticated) {
            console.log("User is authenticated", userSession)
        } else {
            console.log("User is not authenticated")
        }
    }
    , [isAuthenticated, userSession])

    return (
        loading? <h3>Loading ...</h3> :isAuthenticated ? (
            <Box className={"layout"}>
            <NavigationBar/>
            <Outlet/>
            </Box>
        ): <Navigate to="/login" replace />
    )
}