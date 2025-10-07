import {useEffect, useState} from "react";
import {Box, Modal, Typography, TextField, Button, CircularProgress} from "@mui/material";
import {toast} from "react-toastify";
import api from "../../../../components/auth/axiosConfig.js"

function AddOwner({isOpen, onClose, businessId, onOwnerAdded}) {
    const [ownerData, setOwnerData] = useState({name: "", phoneNumber: ""});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setOwnerData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (ownerData.name && ownerData.phoneNumber) {
            setLoading(true);
            try {
                const newOwner = {...ownerData};
                await api.post(`/Business/${businessId}/permission`, newOwner);
                onOwnerAdded(newOwner);
                onClose();

            } finally {
                setLoading(false);
            }
        } else {
            toast.error("لطفا همه فیلدها را پر کنید.");
        }
    };

    const resetForm = () => {
        setOwnerData({name: "", phoneNumber: ""});
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: "8px",
                    minWidth: "300px",
                }}
            >
                <Typography variant="h6" mb={2}>
                    افزودن مالک به {businessId?.title}
                </Typography>
                <TextField
                    label="نام مالک"
                    fullWidth
                    name="name"
                    value={ownerData.name}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="شماره تلفن"
                    fullWidth
                    name="phoneNumber"
                    value={ownerData.phoneNumber}
                    onChange={handleChange}
                    margin="normal"
                />
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="secondary" onClick={onClose}>
                        بستن
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={loading && <CircularProgress color="inherit" size={16}/>}
                    >
                        {loading ? "در حال افزودن..." : "اضافه کردن"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default AddOwner;
