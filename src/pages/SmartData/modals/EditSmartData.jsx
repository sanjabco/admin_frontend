import {useEffect, useState} from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    CircularProgress,
    TextField,
} from "@mui/material";
import {toast} from "react-toastify";
import api from "../../../components/auth/axiosConfig.js";
import PriceInput from "../../../components/common/PriceInput.jsx";

const EditSmartData = ({open, onClose, id, item, onUpdate}) => {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        title: "",
        description: "",
        pricePerItem: "",
    });

    useEffect(() => {
        if (open && item) {
            setFormValues({
                title: item.title || "",
                description: item.description || "",
                pricePerItem: item.pricePerItem || "",
            });
        }

        if (!open) {
            resetForm();
        }
    }, [open, item]);

    const resetForm = () => {
        setFormValues({
            title: "",
            description: "",
            pricePerItem: "",
        });
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formValues.title) {
            toast.error("لطفا عنوان را وارد کنید.");
            return;
        }

        if (!formValues.pricePerItem || isNaN(formValues.pricePerItem)) {
            toast.error("قیمت باید عدد باشد.");
            return;
        }

        setLoading(true);
        try {
            const response = await api.put(`/smart-data/${id}`, {
                title: formValues.title,
                description: formValues.description,
                pricePerItem: Number(formValues.pricePerItem),
            });

            if (response.status === 200) {
                toast.success("داده با موفقیت ویرایش شد!");
                resetForm();
                onClose();
                if (onUpdate) onUpdate();
            }
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
                    backgroundColor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: "8px",
                    minWidth: "300px",
                }}
            >
                <Typography variant="h6" mb={2}>
                    ویرایش داده هوشمند
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" py={5}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    <>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="عنوان"
                            name="title"
                            value={formValues.title}
                            onChange={handleChange}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="توضیحات"
                            name="description"
                            value={formValues.description}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />

                        <PriceInput
                            label="قیمت به ازای هر عدد"
                            value={formValues.pricePerItem}
                            onChange={(val) =>
                                setFormValues((prev) => ({
                                    ...prev,
                                    pricePerItem: val,
                                }))
                            }
                        />

                        <Box display="flex" justifyContent="flex-end" mt={3}>
                            <Button
                                onClick={onClose}
                                variant="contained"
                                color="secondary"
                                sx={{mr: 1}}
                                disabled={loading}
                            >
                                بستن
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                color="primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{color: "white"}}/>
                                ) : (
                                    "ذخیره"
                                )}
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default EditSmartData;
