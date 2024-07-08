import { Box, Button, Divider, Grid, List, ListItem, ListItemButton, TextField, Typography } from '@mui/material';
import { buttonStyle } from '../Styles';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import GlobalStoreContext from '../store';
import { useContext } from 'react';
import AuthContext, { UserRoleType } from '../auth';

export default function ForumScreen() {
    const navigate = useNavigate();
    const {store} = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);

    function handleOpenThread(event) {
        store.openThread(event);
    }

    return (
        <div id="forum-screen">
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
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        {auth.role !== UserRoleType.GUEST && (
                            <Button variant="contained"
                                sx={[buttonStyle, { left: '2%', mb: 1, fontSize: '12px' }]}
                                onClick={()=>{navigate("/newthread")}}>
                                Start New Thread
                            </Button>
                        )}
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={4}>
                        <TextField label="Search" size="small" />
                        <Button variant='outlined' sx={{
                            mt: 1,
                            mb: 1,
                            fontSize: '10px',
                            borderColor: 'black',
                            borderRadius: 0,
                            color: 'black'
                        }}>
                            Newest
                        </Button>
                        <Button variant='outlined' sx={{
                            mt: 1,
                            mb: 1,
                            fontSize: '10px',
                            borderColor: 'black',
                            borderRadius: 0,
                            color: 'black'
                        }}>
                            Top
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{
                    fontSize: '14px',
                    alignItems: 'center'
                }}>
                    <Grid item xs={8} sx={{
                        textAlign: 'left',
                        ml: 3
                    }}>
                        Search Results
                    </Grid>
                    <Grid item xs={1} sx={{ fontSize: '10px'}}>
                        Author
                    </Grid>
                    <Grid item xs={1} sx={{ fontSize: '10px'}}>
                        Replies
                    </Grid>
                    <Grid item xs={1} sx={{ fontSize: '10px'}}>
                        Views
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    
                    <List sx={{ 
                        width: '100%', 
                        ml: 2
                    }}>
                        <ListItem sx={{bgcolor: 'white'}}>
                            <ListItemButton onClick={(event) => {handleOpenThread(event)}}>
                                <Grid item xs={9} sx={{
                                    textAlign: 'left',
                                }}>
                                    <p><strong>Does anyone know how this game works?</strong></p>
                                    <Typography sx={{
                                        fontSize: '10px'
                                    }}>Q&A</Typography>
                                </Grid>
                                <Grid item xs={1} sx={{
                                    fontSize: '10px'
                                }}>
                                    User1
                                </Grid>
                                <Grid item xs={1}>
                                    2
                                </Grid>
                                <Grid item xs={1}>
                                    188
                                </Grid>
                            </ListItemButton>
                        </ListItem>
                        <Divider/>
                        <ListItem sx={{bgcolor: 'white'}}>
                            <ListItemButton onClick={(event) => {handleOpenThread(event)}}>
                                <Grid item xs={9} sx={{
                                    textAlign: 'left',
                                }}>
                                    <p><strong>What are the rules of the game?</strong></p>
                                    <Typography sx={{
                                        fontSize: '10px'
                                    }}>Support</Typography>
                                </Grid>
                                <Grid item xs={1} sx={{
                                    fontSize: '10px'
                                }}>
                                    User2
                                </Grid>
                                <Grid item xs={1}>
                                    20
                                </Grid>
                                <Grid item xs={1}>
                                    100
                                </Grid>
                            </ListItemButton>
                        </ListItem>
                        <Divider/>
                    </List>
                </Grid>
            </Box>
            <BackButton />
        </div>
    );
}