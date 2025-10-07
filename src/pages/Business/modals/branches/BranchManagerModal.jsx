import {useEffect, useState} from "react";
import {
    Modal,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddBranch from "./AddBranch";
import EditBranch from "./EditBranch";
import api from "../../../../components/auth/axiosConfig.js";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";
import {toast} from "react-toastify";
import LineManagerModal from "./lines/LineManagerModal.jsx";

export default function BranchManagerModal({
                                               isOpen,
                                               onClose,
                                               selectedBusiness,
                                               businessId,
                                               onBranchCreated,
                                           }) {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [branches, setBranches] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);
    const [lineModalOpen, setLineModalOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState(null);

    const fetchBranches = async () => {
        const response = await api.get(`/Branch/${businessId}`);
        setBranches(response.data.Data.branches || []);
    };

    useEffect(() => {
        if (isOpen) {
            fetchBranches();
        }
    }, [isOpen]);

    const openEditModal = (branch) => {
        setEditingBranch(branch);
        setEditOpen(true);
    };

    const handleDeleteClick = (branch) => {
        setBranchToDelete(branch);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!branchToDelete) return;

        try {
            await api.delete(`/Branch/${branchToDelete.id}`);
            toast.success("شعبه با موفقیت حذف شد.");
            fetchBranches();
            onBranchCreated();
        } finally {
            setConfirmOpen(false);
            setBranchToDelete(null);
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
                        minWidth: 400,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        مدیریت شعب
                    </Typography>

                    <List className="overflow-auto max-h-52">
                        {branches.length > 0 ? (
                            branches.map((branch) => (
                                <ListItem
                                    key={branch.id}
                                    divider
                                    secondaryAction={
                                        <>
                                            <IconButton
                                                edge="end"
                                                onClick={() => openEditModal(branch)}
                                            >
                                                <EditIcon/>
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                color="error"
                                                onClick={() => handleDeleteClick(branch)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ml: 1}}
                                                onClick={() => {
                                                    setSelectedBranchId(branch.id);
                                                    setLineModalOpen(true);
                                                }}
                                            >
                                                مدیریت بخش ها
                                            </Button>
                                        </>
                                    }
                                >
                                    <ListItemText
                                        primary={branch.title}
                                        secondary={branch.description || "شعبه"}
                                        primaryTypographyProps={{fontWeight: "bold"}}
                                        secondaryTypographyProps={{color: "gray"}}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Typography color="GrayText" textAlign="center">
                                شعبه‌ای یافت نشد.
                            </Typography>
                        )}
                    </List>

                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="contained" color="primary" onClick={() => setAddOpen(true)}>
                            افزودن شعبه
                        </Button>
                        <Button variant="outlined" onClick={onClose}>
                            بستن
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <AddBranch
                isOpen={addOpen}
                onClose={() => setAddOpen(false)}
                selectedBusiness={selectedBusiness}
                onBranchCreated={() => {
                    setAddOpen(false);
                    fetchBranches();
                    onBranchCreated();
                }}
                businessId={businessId}
            />

            <EditBranch
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                branch={editingBranch}
                onBranchUpdated={() => {
                    setEditOpen(false);
                    fetchBranches();
                    onBranchCreated();
                }}
            />

            <ConfirmDialog
                open={confirmOpen}
                title="حذف شعبه"
                content={`آیا از حذف "${branchToDelete?.title}" مطمئن هستید؟`}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setConfirmOpen(false);
                    setBranchToDelete(null);
                }}
            />
            <LineManagerModal
                isOpen={lineModalOpen}
                onClose={() => setLineModalOpen(false)}
                branchId={selectedBranchId}
            />
        </>
    );
}
