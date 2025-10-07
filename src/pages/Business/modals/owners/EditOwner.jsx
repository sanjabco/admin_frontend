import {useState, useEffect} from "react";
import {Modal, Box, Typography, TextField, Button} from "@mui/material";
import api from "../../../../components/auth/axiosConfig";
import {toast} from "react-toastify";

export default function EditOwner({isOpen, onClose, ownerData, businessId, onOwnerUpdated}) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        if (ownerData) {
            setName(ownerData.name);
            setPhone(ownerData.phone);
        }
    }, [ownerData]);

    const handleSubmit = async () => {
        await api.put(`/Business/ownership/${ownerData.id}`, {name, number: phone, businessId});
        toast.success("اطلاعات مالک به‌روزرسانی شد.");
        onOwnerUpdated();
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    minWidth: 300
                }}
            >
                <Typography variant="h6" mb={2}>ویرایش مالک</Typography>
                <TextField
                    fullWidth
                    label="نام"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="شماره تلفن"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    margin="normal"
                />
                <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                    <Button onClick={onClose}>لغو</Button>
                    <Button variant="contained" onClick={handleSubmit}>ذخیره</Button>
                </Box>
            </Box>
        </Modal>
    );
}