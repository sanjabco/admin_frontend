import {useState, useEffect} from "react";
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

const AddBusiness = ({isOpen, onClose, onBusinessCreated}) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        categoryId: "",
        title: "",
        phoneNumber: "",
        email: "",
        description: "",
    });

    const fetchCategories = async () => {
        const {data} = await api.get("/Category/dropdown");
        setCategories(data.Data.categories);
    };

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        } else {
            resetForm();
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues((prev) => ({...prev, [name]: value}));
    };

    const handleCategoryChange = (e) => {
        setFormValues((prev) => ({...prev, categoryId: e.target.value}));
    };

    const handleSubmit = async () => {
        if (!formValues.categoryId || !formValues.title || !formValues.phoneNumber) {
            toast.error("لطفاً تمام فیلدهای الزامی را پر کنید.");
            return;
        }
        setLoading(true);
        try {
            await api.post("/Business", formValues);
            toast.success("کسب‌وکار با موفقیت اضافه شد.");
            onBusinessCreated();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormValues({
            categoryId: "",
            title: "",
            phoneNumber: "",
            email: "",
            description: "",
        });
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
                    ایجاد کسب‌وکار
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Select
                        value={formValues.categoryId}
                        onChange={handleCategoryChange}
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
                        type="number"
                        value={formValues.phoneNumber}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="ایمیل"
                        name="email"
                        type="email"
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
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24}/> : "ایجاد"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddBusiness;
