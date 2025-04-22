import { Box, Button } from "@mui/material"
import supabase from "../supabase";
import { useNavigate } from "react-router";

export const NavigationBar = () => {

    const navigate = useNavigate();

    const handleSignOut = async () => {
        // Handle sign out logic here
        console.log("Sign out clicked");
        const { error } = await supabase.auth.signOut() 
        if (error) {
            console.error("Error signing out:", error);
        } else {
            console.log("Signed out successfully");
        }
        navigate("/login");

    }


    return (
        <Box className="navigation-bar">
            <Box className="logo">
                GDocs POC
            </Box>

            <Box className="nav-items">
                <Box className="nav-item">
                    Dashboard
                </Box>
                <Box className="nav-item">
                    Profile
                </Box>
                <Button variant="outlined" className="nav-item" onClick={handleSignOut}>
                    Logout
                </Button>
            </Box>
        </Box>

    )
}