import { Box, Card, CardActionArea, CardActions, CardMedia, Divider, Grid, IconButton, LinearProgress, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import GlobalStoreContext from '../store';
import EditIcon from '@mui/icons-material/Edit';
import BackButton from './BackButton';
import avatar from '../assets/default-avatar.jpg';
import AuthContext from '../auth';
import { useLocation } from 'react-router-dom';

export default function ProfileScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const {state} = useLocation();
    const {currUsername} = state;

    const [showProfileScreen, setShowProfileScreen] = useState(true);
    const [editEnabled, setEditEnabled] = useState(false);
    const [bio, setBio] = useState("")
    const [postImage, setPostImage] = useState("")
    const [regDate, setRegDate] = useState("")

    // Handles switching between Profile screen and Achievements screen
    const handleToggleScreen = () => {
        setShowProfileScreen(!showProfileScreen);
    };

    // Handles submitting the profile info once editing is turned off
    async function handleEditProfile(event) {
        console.log("EDITING")
        if (editEnabled) {
            try {
                await store.updateProfile(bio, postImage, regDate)
            } catch (error) {
                console.log(error)
            }
        }

        setEditEnabled(!editEnabled);
    }

    // Handles changing the bio state value
    function handleBioChange(event) {
        setBio(event.target.value)
    }

    // When a pfp is uploaded, it's converted to base 64 and sent to the server
    async function handleFileUpload(event) {
        const file = event.target.files[0]
        
        // If the user actually uploaded a file instead of cancelling
        if (file) {
            const base64 = await convertToBase64(file)
            setPostImage(base64)
        }
    }

    function handleSubmit(event) {
        event.preventDefault()
    }

    // Helper function to convert a file into base 64
    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file) // read contents of file
            fileReader.onload = () => { // when read is successful, return contents of the file
                resolve(fileReader.result)
            }
        })
    }

    // Helper function to convert JS date to readable string
    function dateToString(date) {
        if(!date) return;
        const newDate = new Date(date);
        const month = newDate.toLocaleString('default', {month: 'long'});
        return `${month} ${newDate.getDate()}, ${newDate.getFullYear()}`;
    }

    useEffect(() => {
        store.getProfile(currUsername)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        console.log(store)
        if(store.profileInfo) {
            setBio(store.profileInfo.bio)
            setPostImage(store.profileInfo.pfp)
            setRegDate(dateToString(store.profileInfo.regDate))
        }
        // eslint-disable-next-line
    }, [store.profileInfo])

    const profileScreen = (
            <Card sx={{
                bgcolor: '#4D9147',
                top: '20%',
                left: '25%',
                position: 'absolute',
                boxShadow: 10,
                textAlign: 'center',
                borderRadius: '16px',
                color: 'white', 
            }}>
                <Card>
                    <Divider />
                    <Box sx={{
                        bgcolor: '#e3e3e3',
                        width: '100%',
                        height: '70%',
                        color: 'black',
                    }}>
                        <Grid container spacing={4} sx={{textAlign: 'left'}}>
                            <Grid item xs={12} sx={{
                                bgcolor: '#4D9147',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <h1>Mayhem Hospital</h1>
                            </Grid>
                            <Grid item xs={1}/>
                            <Grid item xs={4}>
                                <Box sx={{
                                    width: '140px',
                                    height: '140px',
                                    border: 2,
                                    borderColor: 'black',
                                    ml: 2
                                }}>
                                    <form
                                        onSubmit={handleSubmit}>
                                        <label htmlFor="file-upload">
                                            <img 
                                                src={postImage || avatar}
                                                width={140}
                                                height={140}
                                                alt=''
                                                style = {{
                                                    filter: editEnabled ? "brightness(.4)" : "brightness(1)",
                                                    cursor: editEnabled ? "pointer" : "auto"
                                                }}>
                                            </img>
                                        </label>
                                        <input
                                            type="file"
                                            label="Image"
                                            name="myFile"
                                            id='file-upload'
                                            accept='.jpeg, .png, .jpg'
                                            style={{display: "none"}}
                                            disabled={!editEnabled}
                                            onChange={(event) => handleFileUpload(event)}>
                                        </input>
                                    </form>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sx={{fontSize: '12pt'}}>
                                <>
                                    <p id='username-text'>
                                        {auth.username}
                                    </p>
                                    <p>
                                        Last Seen: Now<br/>
                                        Registered Since: {regDate}
                                    </p>
                                </>
                            </Grid>
                            <Grid item xs={1} />
                            <Grid item xs={12} />
                        </Grid>   
                    </Box>
                </Card>
                <CardActions>
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: 'white'
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField 
                                    id="bio"
                                    label="Bio"
                                    multiline
                                    fullWidth
                                    rows={4}
                                    defaultValue={bio}
                                    onChange={handleBioChange}
                                    variant="filled"
                                    disabled={!editEnabled}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{
                                bgcolor: '#4D9147',
                            }}>
                                {
                                    // Edit button should only appear if user is on their own profile screen
                                    auth.username === currUsername &&
                                    <IconButton id='edit-button' onClick={(event) => {handleEditProfile(event)}} sx={{color: editEnabled ? 'red' : 'white'}}>
                                        <EditIcon />
                                    </IconButton>
                                }
                            </Grid>
                        </Grid>
                    </Box>
                </CardActions>          
            </Card>
    );

    const achievementsScreen = (
        <Card sx={{
            bgcolor: '#4D9147',
            top: '20%',
            left: '25%',
            position: 'absolute',
            boxShadow: 10,
            textAlign: 'center',
            borderRadius: '16px',
            color: 'white', 
            width: '53%'
        }}>
            <CardActionArea 
                onClick={handleToggleScreen}>
                <Divider />
                <Box sx={{
                    bgcolor: '#e3e3e3',
                    width: '100%',
                    height: '70%',
                    color: 'black',
                }}>
                    <Grid container spacing={4} sx={{
                        textAlign: 'center'
                    }}>
                        <Grid item xs={12} sx={{
                            bgcolor: '#4D9147',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <h1>Mayhem Hospital</h1>
                        </Grid>
                        <Grid item xs={3}>
                            <Box sx={{
                                width: '140px',
                                height: '140px',
                                ml: 2
                            }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image="https://upload.wikimedia.org/wikipedia/commons/d/d6/Gold_coin_icon.png"
                                    title="medal1"
                                />
                            </Box>
                            
                        </Grid>
                        <Grid item xs={3}>
                            <Box sx={{
                                width: '140px',
                                height: '140px',
                                ml: 2
                            }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image="https://upload.wikimedia.org/wikipedia/commons/d/d6/Gold_coin_icon.png"
                                    title="medal2"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Box sx={{
                                width: '140px',
                                height: '140px',
                                ml: 2
                            }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image="https://upload.wikimedia.org/wikipedia/commons/d/d6/Gold_coin_icon.png"
                                    title="medal3"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Box sx={{
                                width: '140px',
                                height: '140px',
                                ml: 2
                            }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image="https://upload.wikimedia.org/wikipedia/commons/d/d6/Gold_coin_icon.png"
                                    title="medal4"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={3} sx={{
                        }}>
                            <Box sx={{ width: '80%', ml: '10%'}}>
                                <LinearProgress variant="determinate" value={32} />
                            </Box>
                            <p>
                                Win/Loss Ratio<br/>
                                20-9<br/>
                                Patients Saved<br/>
                                182
                            </p>
                        </Grid>
                        <Grid item xs={3} sx={{
                        }}>
                            <Box sx={{ width: '80%', ml: '10%'}}>
                                <LinearProgress variant="determinate" value={50} />
                            </Box>
                            <p>
                                Minigames Completed per Game<br/>
                                109<br/>
                                Patient Deaths<br/>
                                36
                            </p>
                        </Grid>
                        <Grid item xs={3} sx={{
                        }}>
                            <Box sx={{ width: '80%', ml: '10%'}}>
                                <LinearProgress variant="determinate" value={20} />
                            </Box>
                            <p>
                                Time Played<br/>
                                9h 50m 2s<br/>
                                Favorite Fellow Doctor<br/>
                                JareBear
                            </p>
                        </Grid>
                        <Grid item xs={3} sx={{
                        }}>
                            <Box sx={{ width: '80%', ml: '10%'}}>
                                <LinearProgress variant="determinate" value={100} />
                            </Box>
                            <p>
                                Longest Win Streak<br/>
                                3<br/>
                                Most Played Map<br/>
                                Healing Havoc
                            </p>
                        </Grid>
                    </Grid>   
                </Box>
            </CardActionArea>   
        </Card>
    );

    return (
        <div id="profile-screen">
            {showProfileScreen ? profileScreen : achievementsScreen}
            
            <BackButton />
        </div>
    );
}