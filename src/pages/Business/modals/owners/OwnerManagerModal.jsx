import React, {useState} from "react";
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
import {Edit, Delete} from "lucide-react";
import AddOwner from "./AddOwner";
import EditOwner from "./EditOwner";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";
import api from "../../../../components/auth/axiosConfig";
import {toast} from "react-toastify";

export default function OwnerManagerModal({isOpen, onClose, owners = [], onOwnersChanged, businessId}) {
    const [addOpen, setAddOpen] = useState(false);
    const [editOwner, setEditOwner] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({open: false, owner: null});
    const [actionLoading, setActionLoading] = useState(false);

    const handleDeleteOwner = async (owner) => {
        setActionLoading(true);
        try {
            await api.delete(`/Business/ownership/${owner.id}`);
            toast.success(`مالک ${owner.name} حذف شد.`);
            onOwnersChanged();
        } finally {
            setConfirmDelete({open: false, owner: null});
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
                        minWidth: 400
                    }}
                >
                    <Typography variant="h6" mb={2}>مدیریت مالکین</Typography>
                    {actionLoading && (
                        <Box textAlign="center" mb={2}>
                            <CircularProgress size={24}/>
                        </Box>
                    )}
                    <List>
                        {owners.map((person, idx) => (
                            <ListItem key={idx} divider secondaryAction={
                                <>
                                    <IconButton
                                        onClick={() => setEditOwner(person)}
                                        disabled={actionLoading}
                                    >
                                        <Edit size={18}/>
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setConfirmDelete({open: true, owner: person})}
                                        disabled={actionLoading}
                                    >
                                        <Delete size={18}/>
                                    </IconButton>
                                </>
                            }>
                                <ListItemText
                                    primary={person.name}
                                    secondary={`شماره تلفن: ${person.phone}`}
                                    secondaryTypographyProps={{style: {color: 'Gray'}}}
                                />

                            </ListItem>
                        ))}
                    </List>

                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button
                            variant="contained"
                            onClick={() => setAddOpen(true)}
                            disabled={actionLoading}
                        >
                            افزودن مالک جدید
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

            <AddOwner
                isOpen={addOpen}
                onClose={() => setAddOpen(false)}
                businessId={businessId}
                onOwnerAdded={() => {
                    onOwnersChanged();
                    setAddOpen(false);
                }}
            />

            <EditOwner
                isOpen={Boolean(editOwner)}
                onClose={() => setEditOwner(null)}
                ownerData={editOwner}
                onOwnerUpdated={() => {
                    onOwnersChanged();
                    setEditOwner(null);
                }}
            />

            <ConfirmDialog
                open={confirmDelete.open}
                title="حذف مالک"
                content={`آیا مطمئن هستید که می‌خواهید ${confirmDelete.owner?.name} را حذف کنید؟`}
                onConfirm={() => handleDeleteOwner(confirmDelete.owner)}
                onCancel={() => setConfirmDelete({open: false, owner: null})}
            />
        </>
    );
}