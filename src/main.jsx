import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {ThemeProvider} from "@mui/material";
import {CacheProvider} from "@emotion/react";

import {router} from "./routes/router";
import {theme, cacheRtl} from "../mui.config.js";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router}/>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </ThemeProvider>
        </CacheProvider>
    </StrictMode>
);
