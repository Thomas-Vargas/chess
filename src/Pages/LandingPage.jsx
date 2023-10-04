import { Stack } from "@mui/material";
import ChessBoard from "../components/ChessBoard/ChessBoard";
import LoginCard from "../components/LoginCard/LoginCard";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../components/AuthProvider/AuthProvider";

const LandingPage = () => {
    const navigate = useNavigate();

    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/testPage')
        }
    }, [user])
    return (
        <div>
            <Stack direction="row" gap={8} justifyContent="center" width="100%">
                <ChessBoard />
                <LoginCard />
            </Stack>
        </div>
    )
}

export default LandingPage;