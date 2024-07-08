import { Box, Button, Grid, List, ListItem, Typography } from '@mui/material';

import BackButton from './BackButton';
import { buttonStyle } from '../Styles';
import { useContext } from 'react';
import GlobalStoreContext from '../store';

export default function ReportsScreen() {
    const { store } = useContext(GlobalStoreContext);

    function handleIgnoreButton(event) {
        store.ignoreReport(event);
    }

    function handleMoreOptions(event) {
        store.completeReport(event);
    }

    return (
        <div id="about-screen">
            <Box
                sx={{
                    height: '90%',
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    m: 5
                }}>
                <Typography variant="h4" gutterBottom>Reports</Typography>
                <Box sx={{
                    overflow: 'scroll',
                    overflowX: 'hidden',
                    width: '95%',
                    height: '80%',
                }}>
                    <List sx={{
                    }}>
                        <ListItem disablePadding sx={{bgcolor: 'white', mb: 2}}>
                            <Grid container spacing={2} sx={{alignItems: 'center'}}>
                                <Grid item xs={10}>
                                    <Typography sx={{
                                        ml: 2
                                    }}>
                                            <strong>Report Against McKillaGorilla</strong><br/>
                                            by Joji John<br/>
                                            <br/>
                                            He plays too much
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button 
                                        onClick={(event) => {handleIgnoreButton(event)}}
                                        sx={{
                                            bgcolor: 'red',
                                            color: 'black',
                                            m: 1
                                    }}>
                                        Ignore
                                    </Button>
                                    <Button 
                                        onClick={(event) => {handleMoreOptions(event)}}
                                        sx={[buttonStyle, {
                                            color: 'white',
                                            m: 1
                                    }]}>
                                        More Actions
                                    </Button>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>
                </Box>
            </Box>
            
            <BackButton />
        </div>
    );
}