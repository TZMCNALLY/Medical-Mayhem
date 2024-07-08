import { Box, Button, Grid, TextField } from '@mui/material';
import { buttonStyle } from '../Styles';
import BackButton from './BackButton';
import GlobalStoreContext from '../store';
import { useContext } from 'react';

export default function ForumScreen() {
    const {store} = useContext(GlobalStoreContext);

    function handlePostThread(event) {
        store.postThread(event);
    }

    return (
        <div id="new-thread-screen">
            <Box sx={{
                height: '90%',
                width: '45%',
                flexDirection: 'column',
                backgroundColor: '#fffbc3',
                position: 'absolute',
                left: '27.5%',
                top: '3%',
                textAlign: 'center',
                p: 2,
                boxShadow: 10
            }}/>
            <Box
                sx={{
                    height: '85%',
                    width: '40%',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    position: 'absolute',
                    left: '30%',
                    top: '5%',
                    textAlign: 'center',
                    p: 2,
                    boxShadow: 10
                }}>
                <h3>Forums</h3>
                <Box sx={{
                }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <h4>Create Post</h4>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Title (100 characters or less)" fullWidth variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                id="filled-multiline-static"
                                multiline
                                fullWidth
                                rows={4}
                                variant="outlined"
                                label="text">
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Tags" fullWidth variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                onClick={(event) => {handlePostThread(event)}}
                                sx={[buttonStyle, {color: 'white', }]}>
                                Post Thread
                            </Button>
                        </Grid>
                    </Grid>
                    
                </Box>
            </Box>
            
            <BackButton />
        </div>
    );
}