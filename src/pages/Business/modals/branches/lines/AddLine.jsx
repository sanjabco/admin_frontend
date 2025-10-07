import {useState} from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Modal,
    CircularProgress
} from "@mui/material";
import {toast} from "react-toastify";
import PriceInput from "../../../../../components/common/PriceInput.jsx";
import api from "../../../../../components/auth/axiosConfig.js";

function AddLine({isOpen, onClose, onLineCreated, branchId}) {
    const [lineTitle, setLineTitle] = useState("");
    const [lineDescription, setLineDescription] = useState("");
    const [maxCreditPay, setMaxCreditPay] = useState("");
    const [sharePercentage, setSharePercentage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!lineTitle || !lineDescription || !maxCreditPay || !sharePercentage) {
            toast.error("لطفاً همه فیلدها را پر کنید.");
            return;
        }

        setLoading(true);
        try {
            const lineData = {
                title: lineTitle,
                description: lineDescription,
                maxPayAmountByCashBack: parseFloat(maxCreditPay),
                branchSharePercentage: parseFloat(sharePercentage)
            };

            const response = await api.post(`/Branch/${branchId}/line`, lineData);

            if (response.status === 200) {
                toast.success("بخش جدید با موفقیت ایجاد شد.");
                onLineCreated();
                resetForm();
                onClose();
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setLineTitle("");
        setLineDescription("");
        setMaxCreditPay("");
        setSharePercentage("");
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
                    minWidth: "360px",
                }}
            >
                <Typography variant="h6" mb={2}>
                    افزودن بخش جدید
                </Typography>

                <TextField
                    label="عنوان بخش"
                    fullWidth
                    variant="outlined"
                    value={lineTitle}
                    onChange={(e) => setLineTitle(e.target.value)}
                    required
                    margin="normal"
                />
                <TextField
                    label="توضیحات"
                    fullWidth
                    variant="outlined"
                    value={lineDescription}
                    onChange={(e) => setLineDescription(e.target.value)}
                    required
                    margin="normal"
                />
                <PriceInput
                    label="حداکثر اعتبار پرداخت"
                    value={maxCreditPay}
                    onChange={setMaxCreditPay}
                    mb={2}
                />
                <TextField
                    label="درصد مشارکت شعبه"
                    fullWidth
                    variant="outlined"
                    value={sharePercentage}
                    onChange={(e) => setSharePercentage(e.target.value)}
                    required
                    type="number"
                    margin="normal"
                />

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
                        {loading ? <CircularProgress size={24} sx={{color: "white"}}/> : "ایجاد بخش"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default AddLine;
