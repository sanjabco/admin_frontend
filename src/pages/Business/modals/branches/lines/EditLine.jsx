import {useState, useEffect} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress
} from "@mui/material";
import {toast} from "react-toastify";
import PriceInput from "../../../../../components/common/PriceInput.jsx";
import api from "../../../../../components/auth/axiosConfig.js";

export default function EditLine({isOpen, onClose, lineData, onLineUpdated}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [maxCreditPay, setMaxCreditPay] = useState("");
    const [sharePercentage, setSharePercentage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lineData) {
            setTitle(lineData.title || "");
            setDescription(lineData.description || "");
            setMaxCreditPay(lineData.maxPayAmountByCashBack?.toString() || "");
            setSharePercentage(lineData.branchSharePercentage?.toString() || "");
        }
    }, [lineData]);

    const handleSave = async () => {
        if (!title || !description || !maxCreditPay || !sharePercentage) {
            toast.error("لطفاً همه فیلدها را پر کنید.");
            return;
        }

        setLoading(true);
        try {
            await api.put(`/Line/${lineData.id}`, {
                title,
                description,
                maxPayAmountByCashBack: parseFloat(maxCreditPay),
                branchSharePercentage: parseFloat(sharePercentage),
            });

            toast.success("بخش با موفقیت ویرایش شد.");
            onLineUpdated();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth>
            <DialogTitle>ویرایش بخش</DialogTitle>
            <DialogContent>
                <TextField
                    label="عنوان بخش"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="توضیحات"
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    type="number"
                    value={sharePercentage}
                    onChange={(e) => setSharePercentage(e.target.value)}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    بستن
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit"/> : null}
                >
                    {loading ? "در حال ذخیره..." : "ذخیره"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
