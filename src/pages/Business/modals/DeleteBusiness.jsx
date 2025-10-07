import {useCallback, useState} from "react";
import {
    Box,
    Typography,
    Modal,
    Button,
    CircularProgress,
} from "@mui/material";
import {toast} from "react-toastify";
import api from "../../../components/auth/axiosConfig.js";

const DeleteBusiness = ({isOpen, onClose, onBusinessDelete, businessId}) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async () => {
        setLoading(true);
        try {
            console.log(businessId);
            await api.delete(`/Business/business/${businessId}`);
            toast.success("کسب‌وکار با موفقیت حذف شد.");
            onBusinessDelete();
            onClose();
        } finally {
            setLoading(false);
        }
    }, [businessId]);

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
                    borderRadius: 2,
                    width: 400,
                }}
            >
                <Typography variant="h6" mb={2}>
                    حدف کسب‌وکار
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Typography variant="h6" component="h2">
                        آیا از <span className="text-red-600 font-bold">حذف</span> این کسب و کار اطمینان دارید؟
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                        <Button onClick={onClose} variant="outlined" color="secondary">
                            لغو
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24}/> : "حذف"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteBusiness;
