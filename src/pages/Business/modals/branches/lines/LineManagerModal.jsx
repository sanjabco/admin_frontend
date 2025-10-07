import {useState, useEffect} from "react";
import {
    Modal,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Button,
    CircularProgress
} from "@mui/material";
import {Edit, Trash2 as Delete} from "lucide-react";
import AddLine from "./AddLine.jsx";
import EditLine from "./EditLine.jsx";
import ConfirmDialog from "../../../../../components/common/ConfirmDialog.jsx";
import api from "../../../../../components/auth/axiosConfig.js";
import {toast} from "react-toastify";

export default function LineManagerModal({
                                             isOpen,
                                             onClose,
                                             businessId,
                                             branchId,
                                             onLinesChanged
                                         }) {
    const [addOpen, setAddOpen] = useState(false);
    const [editLine, setEditLine] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({open: false, line: null});
    const [actionLoading, setActionLoading] = useState(false);
    const [lines, setLines] = useState([]);
    const [loadingLines, setLoadingLines] = useState(false);

    const fetchLines = async () => {
        if (!branchId) return;
        setLoadingLines(true);
        try {
            const response = await api.get(`/Line/${branchId}`);
            setLines(response.data.Data.lines || []);
        } finally {
            setLoadingLines(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchLines();
        }
    }, [isOpen, branchId]);

    const handleDeleteLine = async (line) => {
        setActionLoading(true);
        try {
            await api.delete(`/Line/${line.id}`);
            toast.success(`بخش «${line.title}» حذف شد.`);
            await fetchLines();
            onLinesChanged?.();
        } finally {
            setConfirmDelete({open: false, line: null});
            setActionLoading(false);
        }
    };

    return (
        <>
            <Modal open={isOpen} onClose={onClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        minWidth: 420,
                        maxHeight: "80vh",
                        overflowY: "auto"
                    }}
                >
                    <Typography variant="h6" mb={2}>مدیریت بخش‌ها</Typography>

                    {(loadingLines || actionLoading) && (
                        <Box textAlign="center" mb={2}>
                            <CircularProgress size={24}/>
                        </Box>
                    )}

                    {lines.length === 0 && !loadingLines ? (
                        <Typography variant="body2" color="text.Gray" textAlign="center">
                            هیچ بخشی ثبت نشده است.
                        </Typography>
                    ) : (
                        <List>
                            {lines.map((line) => (
                                <ListItem
                                    key={line.id}
                                    divider
                                    secondaryAction={
                                        <>
                                            <IconButton
                                                onClick={() => setEditLine(line)}
                                                disabled={actionLoading}
                                            >
                                                <Edit size={18}/>
                                            </IconButton>
                                            <IconButton
                                                onClick={() => setConfirmDelete({open: true, line})}
                                                disabled={actionLoading}
                                            >
                                                <Delete size={18}/>
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <ListItemText
                                        primary={line.title}
                                        secondary={`شناسه: ${line.id}`}
                                        secondaryTypographyProps={{sx: {color: "gray"}}}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}

                    <Box display="flex" justifyContent="space-between" mt={3}>
                        <Button
                            variant="contained"
                            onClick={() => setAddOpen(true)}
                            disabled={actionLoading}
                        >
                            افزودن بخش جدید
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            disabled={actionLoading}
                        >
                            بستن
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <AddLine
                isOpen={addOpen}
                onClose={() => setAddOpen(false)}
                branchId={branchId}
                onLineCreated={() => {
                    fetchLines();
                    onLinesChanged?.();
                }}
            />

            <EditLine
                isOpen={Boolean(editLine)}
                onClose={() => setEditLine(null)}
                lineData={editLine}
                businessId={businessId}
                branchId={branchId}
                onLineUpdated={() => {
                    fetchLines();
                    onLinesChanged?.();
                    setEditLine(null);
                }}
            />

            <ConfirmDialog
                open={confirmDelete.open}
                title="حذف بخش"
                content={`آیا مطمئن هستید که می‌خواهید «${confirmDelete.line?.title}» را حذف کنید؟`}
                onConfirm={() => handleDeleteLine(confirmDelete.line)}
                onCancel={() => setConfirmDelete({open: false, line: null})}
            />
        </>
    );
}
