import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { forwardRef } from 'react';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AlertMessage = ({ open, setOpen, message, severity = 'success' }) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return <>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert severity={severity} sx={{ width: '100%'}} style={{display: 'flex', alignItems: 'center'}}>
                {message}
            </Alert>
        </Snackbar>
    </>
}