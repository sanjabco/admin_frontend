import { Navigate } from 'react-router-dom';
import PropTypes from "prop-types";
import {useAuth} from "../../store/selectors/index.js";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node
}

export default ProtectedRoute;
