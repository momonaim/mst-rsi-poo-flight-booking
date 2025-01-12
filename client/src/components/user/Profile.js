import React, { useRef } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    Avatar,
} from '@mui/material';
import { Close, Save } from '@mui/icons-material';
import { useValue } from '../../context/ContextProvider';
import { updateStatus } from '../../actions/user';

const Profile = () => {
    const {
        state: {
            profile: { open, photoURL },
            currentUser,
        },
        dispatch,
    } = useValue();

    const nameRef = useRef(currentUser?.username || '');
    const emailRef = useRef(currentUser?.email || '');

    const handleClose = () => {
        dispatch({
            type: 'UPDATE_PROFILE',
            payload: { open: false, file: null, photoURL: null },
        });
    };

    const handleSave = () => {
        const updatedUser = {
            ...currentUser,
            username: nameRef.current.value,
            email: emailRef.current.value,
            photoURL: photoURL || currentUser.photoURL,
        };
        updateStatus(updatedUser, updatedUser.id, dispatch);

        dispatch({
            type: 'UPDATE_USER',
            payload: updatedUser,
        });

        handleClose();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                dispatch({
                    type: 'UPDATE_PROFILE',
                    payload: { open: true, file, photoURL: reader.result },
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                Update Profile
                <Button
                    onClick={handleClose}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                    <Close />
                </Button>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <label htmlFor="upload-photo">
                            <input
                                style={{ display: 'none' }}
                                id="upload-photo"
                                name="upload-photo"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <Avatar
                                src={photoURL || currentUser?.photoURL}
                                sx={{ width: 80, height: 80, cursor: 'pointer' }}
                            />
                        </label>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Name"
                            defaultValue={currentUser?.username}
                            inputRef={nameRef}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            defaultValue={currentUser?.email}
                            inputRef={emailRef}
                            disabled // Prevent email editing if required
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleSave}
                    startIcon={<Save />}
                    variant="contained"
                    color="primary"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Profile;
