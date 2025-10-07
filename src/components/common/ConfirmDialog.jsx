import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from "@mui/material";

export default function ConfirmDialog({open, title, content, onConfirm, onCancel}) {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{content}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>خیر</Button>
                <Button color="error" variant="contained" onClick={onConfirm}>بله</Button>
            </DialogActions>
        </Dialog>
    );
}
