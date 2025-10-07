import {useState, useEffect, useCallback} from "react";
import {
    Box,
    Typography,
    Modal,
    TextField,
    Select,
    MenuItem,
    Button,
    CircularProgress,
} from "@mui/material";
import {toast} from "react-toastify";
import api from "../../../components/auth/axiosConfig.js";

const EditBusiness = ({isOpen, onClose, businessId, onBusinessUpdated}) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [formValues, setFormValues] = useState({
        category: "",
        title: "",
        phoneNumber: "",
        email: "",
        description: "",
    });

    const fetchBusiness = useCallback(async () => {
        if (!businessId.id) return;

        setLoading(true);
        try {
            const {data} = await api.get(`/Business/${businessId.id}`);
            const business = data.Data;

            setFormValues({
                categoryId: business.categoryId || "",
                title: business.title || "",
                phoneNumber: business.phoneNumber || "",
                email: business.email || "",
                description: business.description || "",
            });
        } finally {
            setLoading(false);
        }
    }, [businessId]);

    const fetchCategories = useCallback(async () => {
            const {data} = await api.get("/Category/dropdown");
            setCategories(data.Data.categories);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchBusiness();
            fetchCategories();
        }
    }, [isOpen, fetchBusiness, fetchCategories]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async () => {
        setLoadingBtn(true);
        try {
            await api.put(`/Business/${businessId.id}`, formValues);
            toast.success("کسب‌وکار با موفقیت ویرایش شد.");
            onBusinessUpdated();
            onClose();
        } finally {
            setLoadingBtn(false);
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
                    backgroundColor: "white",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    width: 400,
                }}
            >
                <Typography variant="h6" mb={2}>
                    ویرایش کسب‌وکار
                </Typography>
                {loading ? (
                    <CircularProgress/>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Select
                            value={formValues.categoryId}
                            onChange={handleInputChange}
                            name="categoryId"
                            fullWidth
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                انتخاب دسته‌بندی
                            </MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.title}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            label="عنوان کسب‌وکار"
                            name="title"
                            value={formValues.title}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="شماره تلفن"
                            name="phoneNumber"
                            value={formValues.phoneNumber}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="ایمیل"
                            name="email"
                            value={formValues.email}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            label="توضیحات"
                            name="description"
                            value={formValues.description}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                            fullWidth
                        />
                        <Box display="flex" justifyContent="flex-end" gap={1}>
                            <Button onClick={onClose} variant="outlined" color="secondary">
                                لغو
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                color="primary"
                                disabled={loadingBtn}
                            >
                                {loadingBtn ? <CircularProgress size={24}/> : "ذخیره"}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default EditBusiness;
