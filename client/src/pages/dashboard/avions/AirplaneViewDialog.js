import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import Close from "@mui/icons-material/Close";

const AirplaneViewDialog = ({ open, onClose, airplane }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Airplane Details
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Table>
                    <TableBody>
                        {airplane &&
                            Object.entries(airplane).map(([key, value]) => (
                                <TableRow key={key}>
                                    <TableCell sx={{ fontWeight: "bold", color: "gray" }}>
                                        {key}
                                    </TableCell>
                                    <TableCell>{value || "N/A"}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
};

export default AirplaneViewDialog;
