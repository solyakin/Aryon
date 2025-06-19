import { Navigate, Outlet } from "react-router-dom";
import { useUserAuthContext } from "@/context/user/user-hooks";

const ProtectedRoute = () => {
    const { token, pageIsLoaded } = useUserAuthContext();
    // Show nothing while checking auth state
    if (!pageIsLoaded) {
        return null;
    }
    // Redirect to login if no token
    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;