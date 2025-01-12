import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate("/");
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
            }}
        >
            <Typography variant="h3" color="error">
                404 - Page Not Found
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
                The page you are looking for does not exist.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 4 }}
                onClick={handleReturnHome}
            >
                Return to Homepage
            </Button>
        </Box>
    );
};
export default NotFound;