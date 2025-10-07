import {TextField, Button, CircularProgress} from "@mui/material";
import {useState} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {setCookie} from "../../helper/index.js";
import api from "../../components/auth/axiosConfig.js";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const loginUser = async () => {
        if (!username || !password) {
            toast.error("لطفاً نام کاربری و رمز عبور را وارد کنید.");
            return;
        }

        const data = {username, password};
        try {
            setLoading(true);
            const response = await api.post("/Auth", data);
            setCookie("jwt", response.data.Data.token, 1);
            toast.success("به سامانه سنجاب خوش امدید!");
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                padding: "2.7rem",
                height: "100vh",
            }}
        >
            <div style={{
                backgroundColor: "#fff",
                borderRadius: "2rem",
                padding: "2rem",
            }}>
                <div style={{position: "relative", border: "5px solid white", borderRadius: "2rem"}}>
                    <img src="login2.svg" alt="Login Background" style={{borderRadius: "2rem", width: "100%"}}/>
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#fff",
                            border: "8px solid white",
                            borderRadius: "2rem",
                            padding: "1rem",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "1rem",
                        }}
                    >
                        <div className={"flex flex-row gap-3 sm:gap-0 sm:flex-col "}>
                            <h1 style={{fontSize: "1.25rem", fontWeight: "bold"}}>سامانه سنجاب</h1>
                            <p>سامانه اعتبار خرید</p>
                        </div>
                        <img src="sanjab.png" alt="Logo" style={{width: "3rem"}}/>
                    </div>
                </div>

                <div style={{textAlign: "center", marginTop: "1.5rem", marginBottom: "3rem"}}>
                    <h2 style={{fontSize: "1.5rem", fontWeight: "700"}}>ورود به برنامه</h2>
                    <p>نام کاربری و رمز عبور خودتون رو وارد کنید</p>
                </div>

                <div className={"flex flex-col items-center justify-center w-full"}>
                    <div className={"w-[16.5rem]"}>
                        <div style={{display: "flex", justifyContent: "center", marginBottom: "1.5rem"}}>
                            <TextField
                                sx={{label: {color: "Gray"}}}
                                className="w-full"
                                label="نام کاربری"
                                variant="outlined"
                                color="error"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div style={{display: "flex", justifyContent: "center", marginBottom: "1.5rem"}}>
                            <TextField
                                sx={{label: {color: "Gray"}}}
                                className="w-full"
                                label="رمز عبور"
                                type="password"
                                variant="outlined"
                                color="error"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", gap: "1rem"}}>
                    <Button
                        sx={{color: "white", width: "30%"}}
                        variant="contained"
                        color="success"
                        onClick={loginUser}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24}/> : "ورود به سامانه"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Login;
