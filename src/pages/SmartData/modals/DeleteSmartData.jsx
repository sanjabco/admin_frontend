import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
} from "@mui/material";

function DeleteSmartData({open, onClose, onDeleteConfirm, item, loading}) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>حذف داده</DialogTitle>
            <DialogContent>
                <Typography>
                    آیا از حذف <strong>"{item?.title}"</strong> اطمینان دارید؟
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={loading}>
                    انصراف
                </Button>
                <Button
                    onClick={() => onDeleteConfirm(item.id)}
                    color="error"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18}/> : null}
                >
                    {loading ? "در حال حذف..." : "حذف"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteSmartData;
