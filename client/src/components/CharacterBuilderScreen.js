import { Button, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Slider, Switch, TextField } from '@mui/material';
import {FormControl} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import GlobalStoreContext from '../store';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { buttonStyle, splashButtonStyle } from '../Styles';
import player1 from '../assets/Player-1.png';
import player2 from '../assets/Player-2.png';
import player3 from '../assets/Player-3.png';
import player4 from '../assets/Player-4.png';
import player5 from '../assets/Player-5.png';
import player6 from '../assets/Player-6.png';
import addPlayer from '../assets/Add-Player.png.png';

export default function CharacterBuilderScreen() {
    const { store } = useContext(GlobalStoreContext);
    const [selectedCharacter, setCharacter] = useState(0);
    const [customAvatar, setCustomAvatar] = useState(null);
    const [selectedSprite, setSelectedSprite] = useState("");
    const [postSprite, setSprite] = useState("");
    const [speed, setSpeed] = useState(0);
    const [strength, setStrength] = useState(0);
    const [defense, setDefense] = useState(0);
    const [favoredMinigame, setMinigame] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [avatarName, setAvatarName] = useState("");
    // List variables
    const [avatarList, setAvatarList] = useState([]);
    const navigate = useNavigate();


    const players = [
        player1,
        player2,
        player3,
        player4,
        player5,
        player6,
    ];

    function valuetext(value) {
        return `${value}°C`;
    }
    function handleSubmit(event) {
        event.preventDefault();
    }

    async function handleFileUpload(event) {
        // event.preventDefault();
        const file = event.target.files[0]
        
        // If the user actually uploaded a file instead of cancelling
        if (file) {
            const base64 = await convertToBase64(file);
            setSprite(base64);
            setCharacter(7+avatarList.length);
            setSelectedSprite(base64);
        }
    }
    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file) // read contents of file
            fileReader.onload = () => { // when read is successful, return contents of the file
                resolve(fileReader.result)
            }
        })
    }

    useEffect(() => {
        if (store.avatarList && store.avatarList.avatars && store.avatarList.avatars.length >= 0) {
            setAvatarList(store.avatarList.avatars);
        } 
        else {
            store.getMyAvatars();
            setAvatarList([]);
        }
        // eslint-disable-next-line
    }, [store.avatarList])

    useEffect(() => {     
        setSelectedSprite(store.avatar.pic);
        setAvatarName(store.avatar.name);
        setSprite(store.avatar.pic);
        setSpeed(store.avatar.speed);
        setStrength(store.avatar.strength);
        setDefense(store.avatar.defense);
        setMinigame(store.avatar.favoredMinigame);
        setIsPublic(store.avatar.isPublic);
    }, [store.avatar])

    function handleCharacterClick(imageLink, index, customCharacter) {
        setSelectedSprite(imageLink);
        setCharacter(index);
        if(customCharacter) {
            setCustomAvatar(customCharacter);
            setAvatarName(customCharacter.avatarName);
            setSprite(customCharacter.avatarSprite);
            setSpeed(customCharacter.speed);
            setStrength(customCharacter.strength);
            setDefense(customCharacter.defense);
            setMinigame(customCharacter.favoredMinigame);
            setIsPublic(customCharacter.isPublic);
        }
        else {
            setCustomAvatar(null);
            setAvatarName("");
            setSprite("");
            setSpeed(0);
            setStrength(0);
            setDefense(0);
            setMinigame("");
            setIsPublic(false);
        }
    }

    function handleUpdateCharacter() {
        if(selectedSprite && customAvatar) {
            store.updateAvatar(selectedSprite, avatarName, speed, strength, defense, favoredMinigame, isPublic, customAvatar._id);
            store.updateAvatarList(selectedSprite, avatarName, speed, strength, defense, favoredMinigame, isPublic, customAvatar._id);
        }
        else if(selectedSprite) {
            store.updateAvatar(selectedSprite, avatarName, speed, strength, defense, favoredMinigame, isPublic, null);
            store.updateAvatarList(selectedSprite, avatarName, speed, strength, defense, favoredMinigame, isPublic, null);
        }
        else {
            alert("Please upload an image or select a premade one.")
        }
    }

    function handleUpdateName(event) {
        setAvatarName(event.target.value);
    }

    function handleDeleteCharacter(avatar) {
        store.deleteAvatar(avatar._id);

        const index = avatarList.indexOf(avatar);
        if (index > -1) { 
            avatarList.splice(index, 1);
        }
        setCustomAvatar(null);
        setAvatarName("");
        setSprite("");
        setSpeed(0);
        setStrength(0);
        setDefense(0);
        setMinigame("");
        setIsPublic(false);
    }

    return (
        <div id="map-builder-screen">
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{
                    bgcolor: '#3A9158',
                    color: 'white',
                }}>
                    <h1>Build your character!</h1>
                </Grid>
                <Grid item xs={1}>
                    
                </Grid>
                <Grid item xs={4} sx={{ height: '80vh', overflowY: 'scroll', overflowX: 'hidden' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sx={{
                            textAlign: 'center',
                        }}>
                            <strong>Select a premade character or upload your own spritesheet!</strong>
                        </Grid>
                        {players.map((image, index) => (
                            <Grid key={index} item xs={4}>
                                <Paper elevation={3}
                                    id={'character-'+ (index)}
                                    sx={{ 
                                        height: '100%',
                                        width: '100%',
                                        mb: 2,
                                        backgroundColor: selectedCharacter === index ? 'lightblue' : 'white',
                                        border: selectedCharacter === index ? 1 : 0,
                                    }}
                                    onClick={() => handleCharacterClick(image, index, null)}
                                >
                                    <img
                                    src={image}
                                    alt={`${index+1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    />
                                </Paper>
                            </Grid>
                        ))}
                        {avatarList.length === 0 ? (
                            <div/>
                        ) : (
                            avatarList.map((avatar, index) => (
                            <Grid key={index+7} item xs={4}>
                                <Paper elevation={3}
                                    id={'avatar-'+ (index+7)}
                                    sx={{ 
                                        height: '100%',
                                        width: '100%',
                                        mb: 2,
                                        backgroundColor: selectedCharacter === index+7 ? 'lightblue' : 'white',
                                        border: selectedCharacter === index+7 ? 1 : 0,
                                    }}
                                    onClick={() => handleCharacterClick(avatar.avatarSprite, index+7, avatar)}
                                >
                                    <img
                                    src={avatar.avatarSprite}
                                    alt={`${index+1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    />
                                </Paper>
                            </Grid>
                        )))
                        }
                        <Grid item xs={4}>
                            <Paper elevation={3} 
                                id='character-upload'
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    maxHeight: '50vh',
                                    mb: 2,
                                    alignContent: 'center', 
                                    backgroundColor: selectedCharacter === 7+avatarList.length ? 'lightblue' : '#ffffff',
                                    border: selectedCharacter === 7+avatarList.length ? 1 : 0,
                                }}
                                onClick={() => {handleCharacterClick(null, 7+avatarList.length, null)}}
                            >
                                <form
                                    onSubmit={handleSubmit}>
                                    <label htmlFor="file-upload">
                                        <img 
                                            src={addPlayer}
                                            alt=''
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}/>
                                    </label>
                                    <input
                                        type="file"
                                        label="Image"
                                        name="myFile"
                                        id='file-upload'
                                        accept='.jpeg, .png, .jpg'
                                        style={{display: "none"}}
                                        onChange={(event) => handleFileUpload(event)}>
                                    </input>
                                </form>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1}/>
                
                <Grid item xs={5}>
                    <Grid container spacing={2} sx={{
                        alignItems: 'center',
                        backgroundColor: 'white',
                        p: 2,
                        boxShadow: 4,
                        mt: 1
                    }}>
                        <Grid item xs={12}>
                            <img
                                src={selectedSprite}
                                alt=''
                                style={{
                                    maxWidth: '40vw',
                                    maxHeight: '30vh',
                                    objectFit: 'cover',
                            }}/>
                        </Grid>
                        <Grid item xs={12}>
                            <h3>Character Stats</h3>
                        </Grid>

                        {/* <Grid item xs={2}>
                            Speed
                        </Grid>
                        <Grid item xs={1}>
                            0
                        </Grid>
                        <Grid item xs={6}>
                            <Slider
                                id='slider-speed'
                                value={speed}
                                getAriaValueText={valuetext}
                                valueLabelDisplay='auto'
                                shiftStep={3}
                                step={1}
                                marks
                                min={0}
                                max={3}
                                onChange={(event) => {setSpeed(event.target.value)}}
                                sx={{
                                    width: '80%',
                                    '& .MuiSlider-thumb': {
                                        backgroundColor: '#3A915'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            3
                        </Grid>
                        <Grid item xs={1}/>


                        <Grid item xs={2}>
                            Strength
                        </Grid>
                        <Grid item xs={1}>
                            0
                        </Grid>
                        <Grid item xs={6}>
                            <Slider
                                id='slider-strength'
                                value={strength}
                                getAriaValueText={valuetext}
                                valueLabelDisplay='auto'
                                shiftStep={3}
                                step={1}
                                marks
                                min={0}
                                max={3}
                                onChange={(event) => {setStrength(event.target.value)}}
                                sx={{
                                    width: '80%'
                                }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            3
                        </Grid>
                        <Grid item xs={1}/>


                        <Grid item xs={2}>
                            Defense
                        </Grid>
                        <Grid item xs={1}>
                            0
                        </Grid>
                        <Grid item xs={6}>
                            <Slider
                                id='slider-defense'
                                value={defense}
                                getAriaValueText={valuetext}
                                valueLabelDisplay='auto'
                                shiftStep={3}
                                step={1}
                                marks
                                min={0}
                                max={3}
                                onChange={(event) => {setDefense(event.target.value)}}
                                sx={{
                                    width: '80%'
                                }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            3
                        </Grid> 
                        <Grid item xs={1}/>*/}
                        <Grid item xs={8}>
                            <FormControl fullWidth>
                                <InputLabel id="favorite-minigame">Favorite Minigame</InputLabel>
                                <Select
                                size='small'
                                value={favoredMinigame}
                                label="Favorite Minigame"
                                onChange={(event) => {setMinigame(event.target.value)}}
                                >
                                <MenuItem id='select-medication-matching' value={"Medication Matching"}>Medication Matching</MenuItem>
                                <MenuItem id='select-heartbeat-rhythm' value={"Heartbeat Rhythm"}>Heartbeat Rhythm</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControlLabel control={
                                <Switch 
                                    checked={isPublic}
                                    onChange={() => {setIsPublic(!isPublic)}}
                                />
                                } 
                                label="Public" 
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField fullWidth size='small' label='Name' value={avatarName}
                                onChange={(event) => {handleUpdateName(event)}}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <Button id='confirm-changes' fullWidth sx={[buttonStyle, {color: 'white'}]}
                            onClick={() => {handleUpdateCharacter()}}>
                                Confirm Changes
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton disabled={selectedCharacter < 6 || selectedCharacter >= 7+avatarList.length}
                            onClick={() => {handleDeleteCharacter(customAvatar)}} >
                                <DeleteIcon/>
                            </IconButton>
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item xs={1}/>
            </Grid>
            {/* <BackButton/> */}
            <Button id='back-button' variant="contained"
                sx={[splashButtonStyle, {left: '2%', top: '3%', position: 'absolute'}]}
                onClick={()=>{navigate("/")}}>
                Back
            </Button>
        </div>
    );
}