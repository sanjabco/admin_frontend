import {useEffect, useState} from "react";
import {Box, Typography, Button, Modal, TextField, CircularProgress} from "@mui/material";
import {toast} from "react-toastify";
import api from "../../../../components/auth/axiosConfig.js"

function AddBranch({isOpen, onClose, selectedBusiness, businessId, onBranchCreated}) {
    const [branchTitle, setBranchTitle] = useState("");
    const [branchDescription, setBranchDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!branchTitle || !branchDescription) {
            toast.error("لطفاً همه فیلدها را پر کنید.");
            return;
        }

        setLoading(true);
        try {
            const branchData = {
                title: branchTitle,
                description: branchDescription,
            };
            const response = await api.post(`/Business/${businessId}/branch`, branchData);

            if (response.status === 200) {
                onBranchCreated();
                toast.success("ایجاد شعبه موفقیت امیز بود.");
                onClose();
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setBranchTitle("");
        setBranchDescription("");
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
                    borderRadius: "8px",
                    minWidth: "300px",
                }}
            >
                <Typography variant="h6" mb={2}>
                    افزودن شعبه به {selectedBusiness?.title}
                </Typography>
                <Box mb={2}>
                    <TextField
                        label="عنوان شعبه"
                        fullWidth
                        variant="outlined"
                        value={branchTitle}
                        onChange={(e) => setBranchTitle(e.target.value)}
                        required
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="توضیحات"
                        fullWidth
                        variant="outlined"
                        value={branchDescription}
                        onChange={(e) => setBranchDescription(e.target.value)}
                        required
                    />
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
                        {loading ? <CircularProgress size={24} sx={{color: "white"}}/> : "ایجاد شعبه"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default AddBranch;
