import {useEffect, useState} from "react";
import {Modal, Box, Typography, TextField, Button, CircularProgress} from "@mui/material";
import {toast} from "react-toastify";
import {CloudUpload} from "@mui/icons-material";
import api from "../../../components/auth/axiosConfig.js";
import PriceInput from "../../../components/common/PriceInput";

const AddSmartData = ({open, onClose, onAdd}) => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const resetForm = () => {
        setTitle("");
        setPrice("");
        setDescription("");
        setFile(null);
    };

    const handleSubmit = async () => {
        if (!title || !price || !description || !file) {
            toast.error("لطفا تمامی فیلدها را پر کنید.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("pricePerItem", price);
            formData.append("description", description);
            formData.append("excelFile", file);

            await api.post("/smart-data/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("داده با موفقیت اضافه شد!");
            onAdd();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    p: 3,
                    boxShadow: 24,
                    borderRadius: 2,
                    textAlign: "right",
                }}
            >
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    افزودن داده جدید
                </Typography>

                <TextField
                    fullWidth
                    label="عنوان"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{mb: 2}}
                />

                <PriceInput label="قیمت" value={price} onChange={setPrice} error={false} helperText=""/>

                <TextField
                    fullWidth
                    label="توضیحات"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{mb: 2, mt: 2}}
                />

                <Box textAlign="center" mt={2} mb={2}>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        id="file-upload"
                        style={{display: "none"}}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                        <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            startIcon={<CloudUpload/>}
                        >
                            انتخاب فایل اکسل
                        </Button>
                    </label>
                    {file && (
                        <Typography variant="body2" sx={{mt: 1, color: "gray"}}>
                            {file.name}
                        </Typography>
                    )}
                </Box>

                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit"/> : "افزودن"}
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        لغو
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddSmartData;
