import {createBrowserRouter} from "react-router-dom";
import App from '../App'
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import Login from "../pages/Login/Login";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Business from "../pages/Business/Business.jsx";
import SmartData from "../pages/SmartData/SmartData.jsx";   
import Requests from "../pages/Requests/Requests.jsx";
import SMSSystem from "../pages/sms-system/SMSSystem.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute>
            <App/>
        </ProtectedRoute>,
        children: [
            {
                path: "",
                element: <Dashboard/>
            }, {
                path: "/business",
                element: <Business/>
            }, {
                path: "/smart-data",
                element: <SmartData/>
            }, {
                path: "/requests",
                element: <Requests/>
            }, {
                path: "/sms-system",
                element: <SMSSystem/>
            }, {
                path: "/Profile",
                element: <Profile/>
            },
        ]
    },
    {
        path: "/login",
        element: <Login/>
    },
])