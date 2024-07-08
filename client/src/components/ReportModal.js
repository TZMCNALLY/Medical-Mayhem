import { Box, Button, Divider, Grid, Modal, TextField } from '@mui/material';
import { buttonStyle } from '../Styles';
import { useContext } from 'react';
import GlobalStoreContext from '../store';

export default function ReportModal({open, onClose}) {
    const { store } = useContext(GlobalStoreContext);

    function handleSubmitReport(event) {
        store.submitReport(event);
        onClose();
    }

    function handleCancelReport() {
        onClose();
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box sx={{
                width: '30%',
                height: '40%',
                bgcolor: '#4D9147',
                top: '20%',
                left: '35%',
                position: 'absolute',
                boxShadow: 10,
                textAlign: 'center',
                borderRadius: '16px',
                color: 'white'
            }}>
                <h1>Report McKillaGorilla</h1>
                <Divider />
                <Box sx={{
                    bgcolor: '#e3e3e3',
                    alignContent: 'center',
                    textAlign: 'center',
                    color: 'black',
                    pl: 2,
                    pr: 2,
                    pb: 2,
                    borderBottomLeftRadius: '16px',
                    borderBottomRightRadius: '16px'
                }}>
                    <p>Include any additional feedback on McKillaGorilla here.</p>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField 
                                id="filled-multiline-static"
                                multiline
                                fullWidth
                                rows={4}
                                variant="filled"
                                sx={{
                                }}>
                                
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <Button sx={[buttonStyle, {color: 'white', bgcolor: 'gray'}]}
                                onClick={() => {handleCancelReport()}}>
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button sx={[buttonStyle, {color: 'white'}]}
                                onClick={(event) => {handleSubmitReport(event)}}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
}