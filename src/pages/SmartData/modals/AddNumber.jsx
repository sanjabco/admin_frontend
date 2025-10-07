import {useEffect, useState} from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    CircularProgress,
} from "@mui/material";
import {toast} from "react-toastify";
import api from "../../../components/auth/axiosConfig.js";
import {CloudUpload} from "@mui/icons-material";

const AddNumber = ({open, onClose, id}) => {
        const [loading, setLoading] = useState(false);
        const [file, setFile] = useState(null);

        useEffect(() => {
                if (!open) {
                    resetForm();
                }
            }, [open]
        );

        const resetForm = () => {
            setFile(null);
        };

        const handleSubmit = async () => {
            if (!file) {
                toast.error("لطفا فایل اکسل را انتخاب کنید.");
                return;
            }

            setLoading(true);
            try {
                const formData = new FormData();
                formData.append("excelFile", file);

                const response = await api.post(`/smart-data/${id}/import`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.status === 200) {
                    toast.success("شماره با موفقیت اضافه شد!");
                    resetForm();
                    onClose();
                }
            } finally {
                setLoading(false);
            }
        };

        const handleFileChange = (event) => {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setFile(selectedFile);
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
                        backgroundColor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "8px",
                        minWidth: "300px",
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        افزودن تعداد
                    </Typography>

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

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button onClick={onClose} variant="contained" color="secondary" sx={{mr: 1}}>
                            بستن
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} sx={{color: "white"}}/> : "ایجاد"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        );
    }
;

export default AddNumber;
