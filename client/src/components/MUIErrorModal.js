import * as React from 'react';
import { useState, useContext } from 'react';
import GlobalStoreContext from '../store';
import { Alert, AlertTitle, Button, Modal, Stack } from '@mui/material';
import AuthContext from '../auth';

export default function MUIErrorModal({displayErrorModal, setDisplayErrorModal}) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    function handleCloseModal() { 

        // Clear whichever message is nonempty

        if (auth.errorMessage)
            auth.hideModal(); 

        else
            store.hideModal(); 

        setDisplayErrorModal(false)
    }

    return (
        // <Modal id='error' open={auth ? (auth.errorMessage !== "") : (store.errorMessage !== "")}>
        //     <Stack sx={{ width: '40%', marginLeft: '30%', marginTop: '20%' }} spacing={2}>
        //         <Alert severity="error">
        //             <AlertTitle>Error</AlertTitle>
        //             {message}
        //             <Button color="primary" size="small" onClick={handleCloseModal}>
        //                 Close
        //             </Button>
        //         </Alert>
        //     </Stack>
        // </Modal>
        <Modal id='error' open={displayErrorModal}>
            <Stack sx={{ width: '40%', marginLeft: '30%', marginTop: '20%' }} spacing={2}>
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {auth.errorMessage ? auth.errorMessage : store.errorMessage}
                    <Button color="primary" size="small" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Alert>
            </Stack>
        </Modal>
    );
}