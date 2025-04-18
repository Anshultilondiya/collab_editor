import { Box, Button } from "@mui/material"

export const NavigationBar = () => {
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
                <Button variant="outlined" className="nav-item">
                    Logout
                </Button>
            </Box>
        </Box>

    )
}