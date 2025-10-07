import {useState, useEffect} from "react";
import {Modal, Box, Typography, TextField, Button, CircularProgress} from "@mui/material";
import api from "../../../../components/auth/axiosConfig";
import {toast} from "react-toastify";

export default function EditBranchModal({
                                            isOpen,
                                            onClose,
                                            branch,
                                            businessId,
                                            onBranchUpdated,
                                        }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (branch) {
            setName(branch.title || "");
            setDescription(branch.description || "");
        } else {
            setName("");
            setDescription("");
        }
    }, [branch]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("نام شعبه نمی‌تواند خالی باشد.");
            return;
        }

        try {
            setLoading(true);
            await api.put(`/Branch/${branch.id}`, {
                title: name,
                description: description,
                businessId,
            });
            toast.success("شعبه با موفقیت به‌روزرسانی شد.");
            onBranchUpdated();
            onClose();
        } finally {
            setLoading(false);
        }
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
                    minWidth: 300,
                }}
            >
                <Typography variant="h6" mb={2}>
                    ویرایش شعبه
                </Typography>
                <TextField
                    fullWidth
                    label="نام شعبه"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="توضیحات"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                />
                <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                    <Button onClick={onClose} disabled={loading}>
                        لغو
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24}/> : "ذخیره"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
