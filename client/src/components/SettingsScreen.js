import { Box, Button, Divider, Grid, Typography, Slider, Switch, Modal } from '@mui/material';
import BackButton from './BackButton';
import { buttonStyle, confirmButton, innerContentBox, outerContentBox, resetButton } from '../Styles';
import { useContext, useEffect, useState } from 'react';
import GlobalStoreContext from '../store';
import AuthContext, { UserRoleType } from '../auth';
import { useNavigate } from 'react-router-dom';
import socket from '../constants/socket';
import SocketEvents from '../constants/socketEvents';
import { audio } from './MainLayout';

export default function SettingsScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [masterValue, setMasterValue] = useState(100);
    const [musicValue, setMusicValue] = useState(100);
    const [sfxValue, setSfxValue] = useState(100);
    const [modal, setModal] = useState(false);
    const [currInput, setCurrInput] = useState('');
    const [keybinds, setKeybinds] = useState({
        UP: 'W',
        LEFT: 'A',
        DOWN: 'S',
        RIGHT: 'D',
        INTERACT: 'E'
    });
    const [toggles, setToggles] = useState({
        privateProfile: false,
        messages: true,
        party: true,
    });
    const [isDeletingAccount, setIsDeletingAccount] = useState(false)
    const [deleteButtonText, setDeleteButtonText] = useState("Delete Account")
    
    function handleLogout() {
        navigate('/');
        store.reset();
        auth.logoutUser(auth.username);
        socket.emit(SocketEvents.LOGOUT)
    }

    function handleDeleteAcc() {

        if (isDeletingAccount) {
            store.reset()
            auth.deleteUser()
            auth.logoutUser();
        }

        else {
            setIsDeletingAccount(true)
            setDeleteButtonText("Are you sure?")
        }
    }

    function handleResetAudio() {
        if(auth.role === UserRoleType.GUEST) return;
        setMasterValue(100);
        setMusicValue(100);
        setSfxValue(100);
        store.updateAudioSettings(100, 100, 100);
    }
    function handleConfirmAudio() {
        if(auth.role === UserRoleType.GUEST) return;
        store.updateAudioSettings(masterValue, musicValue, sfxValue);
        audio.volume = musicValue/1000.0;
        audio.play();
    }

    function handleResetControls() {
        if(auth.role === UserRoleType.GUEST) return;
        setKeybinds({UP: 'W', LEFT: 'A', DOWN: 'S', RIGHT: 'D', INTERACT: 'E'});
        store.updateKeybinds({UP: 'W', LEFT: 'A', DOWN: 'S', RIGHT: 'D', INTERACT: 'E'});
    }
    function handleConfirmControls() {
        console.log('keybinds:', keybinds);
        store.updateKeybinds(keybinds);
    }

    // const handleMasterSliderChange = (event, newValue) => {
    //     setMasterValue(newValue);
    // }
    const handleMusicSliderChange = (event, newValue) => {
        setMusicValue(newValue);
    }
    // const handleSfxSliderChange = (event, newValue) => {
    //     setSfxValue(newValue);
    // }

    // State change causes modal to open or close
    const toggleModal = () => setModal(!modal);

    // Set user's volume settings upon change
    useEffect(() => {
        if(store.settings) {
            setMasterValue(auth.role === UserRoleType.GUEST ? 100 : store.settings.masterVolume);
            setMusicValue(auth.role === UserRoleType.GUEST ? 100 : store.settings.musicVolume);
            setSfxValue(auth.role === UserRoleType.GUEST ? 100 : store.settings.sfxVolume);
            setKeybinds(auth.role === UserRoleType.GUEST ? {UP: 'W', LEFT: 'A', DOWN: 'S', RIGHT: 'D', INTERACT: 'E'} : store.settings.keybinds);
            setToggles(auth.role === UserRoleType.GUEST ? {privateProfile: false, messages: true, party: true} : store.settings.toggles);
        }
        //eslint-disable-next-line
    }, [store.settings]);

    // Get user's settings
    useEffect(() => {
        if(auth.role !== UserRoleType.GUEST) store.getSettings();
        //eslint-disable-next-line
    }, [])

    return (
        <div id="settings-screen">
            <Grid container>
                <Grid item xs={3}/>
                <Grid item xs={6}>
                    <Grid container sx={outerContentBox}>
                        <Grid item xs={10}>
                            <Grid container sx={innerContentBox}>
                            {/* <Grid container sx={[innerContentBox, { overflow: 'scroll' }]}> */}
                                <Grid item xs={1}/>
                                <Grid item xs={10}>
                                    <Grid container sx={{ justifyContent: 'center' }}>
                                        <Grid item xs={12}>
                                            <h1>Settings</h1>
                                            <Divider />
                                        </Grid>
                                        <Grid container sx={{ alignItems: 'center', mb: 2 }}>
                                            <Grid item xs={12}>
                                                <h4>Audio</h4>
                                            </Grid>
                                            {/* <Grid item xs={3}>Master</Grid>
                                            <Grid item xs={7}>
                                                <Slider
                                                    id='master-slider'
                                                    marks
                                                    // step={1}
                                                    data-cy='master-slider'
                                                    value={typeof masterValue === 'number' ? masterValue : 0}
                                                    onChange={handleMasterSliderChange}
                                                    aria-labelledby="master-slider"
                                                    disabled={auth.role === UserRoleType.GUEST}
                                                />
                                            </Grid>
                                            <Grid id='master-volume' item xs={2}>{masterValue}</Grid> */}

                                            <Grid item xs={3}>Music</Grid>
                                            <Grid item xs={7}>
                                                <Slider
                                                    id='music-slider'
                                                    marks
                                                    step={1}
                                                    value={typeof musicValue === 'number' ? musicValue : 0}
                                                    onChange={handleMusicSliderChange}
                                                    aria-labelledby="music-slider"
                                                    disabled={auth.role === UserRoleType.GUEST}
                                                />
                                            </Grid>
                                            <Grid id='music-volume' item xs={2}>{musicValue}</Grid>

                                            {/* <Grid item xs={3}>SFX</Grid>
                                            <Grid item xs={7}>
                                                <Slider
                                                    id='sfx-slider'
                                                    marks
                                                    step={1}
                                                    value={typeof sfxValue === 'number' ? sfxValue : 0}
                                                    onChange={handleSfxSliderChange}
                                                    aria-labelledby="sfx-slider"
                                                    disabled={auth.role === UserRoleType.GUEST}
                                                />
                                            </Grid>
                                            <Grid id='sfx-volume' item xs={2}>{sfxValue}</Grid> */}
                                        </Grid>
                                        
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Button id='reset-audio' onClick={handleResetAudio} sx={resetButton}>
                                                    Reset
                                                </Button>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Button id='confirm-audio' onClick={handleConfirmAudio} sx={confirmButton}>
                                                    Confirm
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sx={{ mt: 2 }}>
                                                <Divider />
                                            </Grid>
                                        </Grid>

                                        <Grid container id='controls-menu'>
                                            <Grid item xs={6}>
                                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                                    <h4>Controls</h4>
                                                </Grid>
                                                <Grid container sx={{ alignItems: 'center' }}>
                                                    <InputField
                                                        auth={auth} id='up-button' setCurrInput={setCurrInput} toggleModal={toggleModal}
                                                        inputKey='W' inputStr='Up' keybinds={keybinds} keybindControl={keybinds.UP}
                                                    />
                                                    <InputField
                                                        auth={auth} id='left-button' setCurrInput={setCurrInput} toggleModal={toggleModal}
                                                        inputKey='A' inputStr='Left' keybinds={keybinds} keybindControl={keybinds.LEFT}
                                                    />
                                                    <InputField
                                                        auth={auth} id='down-button' setCurrInput={setCurrInput} toggleModal={toggleModal}
                                                        inputKey='S' inputStr='Down' keybinds={keybinds} keybindControl={keybinds.DOWN}
                                                    />
                                                    <InputField
                                                        auth={auth} id='right-button' setCurrInput={setCurrInput} toggleModal={toggleModal}
                                                        inputKey='D' inputStr='Right' keybinds={keybinds} keybindControl={keybinds.RIGHT}
                                                    />
                                                    <InputField
                                                        auth={auth} id='interact-button' setCurrInput={setCurrInput} toggleModal={toggleModal}
                                                        inputKey='E' inputStr='Interact' keybinds={keybinds} keybindControl={keybinds.INTERACT}
                                                    />

                                                    <Grid item xs={6}>
                                                        <Button id='reset-keybinds' onClick={handleResetControls} sx={resetButton}>
                                                            Reset
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Button id='confirm-keybinds' onClick={handleConfirmControls} sx={confirmButton}>
                                                            Confirm
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            
                                            <Grid item xs={6}>
                                                { auth.role !== UserRoleType.GUEST && 
                                                    <div id='settings-guest'>
                                                        <Grid container sx={{ alignItems: 'center', mb: 2 }}>
                                                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                                                <h4>Permissions</h4>
                                                            </Grid>
                                                            <Grid item xs={4}><i>Private Profile</i></Grid>
                                                            <Grid item xs={2}>Off</Grid>
                                                            <Grid item xs={4}>
                                                                <Switch 
                                                                    checked={toggles.privateProfile}
                                                                    onChange={() => {
                                                                        setToggles({
                                                                            privateProfile: !toggles.privateProfile,
                                                                            messages: toggles.messages,
                                                                            party: toggles.party
                                                                        })
                                                                        store.updateToggles(!toggles.privateProfile, toggles.messages, toggles.party);
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>On</Grid>

                                                            <Grid item xs={4}><i>Messages</i></Grid>
                                                            <Grid item xs={2}>Off</Grid>
                                                            <Grid item xs={4}>
                                                                <Switch 
                                                                    checked={toggles.messages}
                                                                    onChange={() => {
                                                                        setToggles({
                                                                            ...toggles,
                                                                            messages: !toggles.messages,
                                                                        })
                                                                        store.updateToggles(toggles.privateProfile, !toggles.messages, toggles.party);
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>On</Grid>

                                                            <Grid item xs={4}><i>Enable Party</i></Grid>
                                                            <Grid item xs={2}>Off</Grid>
                                                            <Grid item xs={4}>
                                                                <Switch 
                                                                    checked={toggles.party}
                                                                    onChange={() => {
                                                                        setToggles({
                                                                            privateProfile: toggles.privateProfile,
                                                                            messages: toggles.messages,
                                                                            party: !toggles.party
                                                                        })
                                                                        store.updateToggles(toggles.privateProfile, toggles.messages, !toggles.party);
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>On</Grid>
                                                        </Grid>
                                                    </div>}
                                                
                                                    { auth.role !== UserRoleType.GUEST ?
                                                        <Grid container>
                                                            <Grid item xs={6}>
                                                                <Button id='log-out' onClick={() => handleLogout()} sx={[confirmButton, {color: 'white', mt: 2}]}>
                                                                    Log Out
                                                                </Button>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Button id='delete-account' onClick={() => {handleDeleteAcc()}} sx={[resetButton, {color: 'white', mt: 2}]}>
                                                                    { deleteButtonText }
                                                                </Button>
                                                            </Grid>
                                                        </Grid> :
                                                        <Grid>
                                                            <Typography variant="h5" gutterBottom><strong>Login to change default settings</strong></Typography>
                                                            <Button id='login' onClick={() => navigate('/login')} sx={[buttonStyle, {color: 'white', mt: 2}]}>
                                                                Log In
                                                            </Button>
                                                            <Button id='register' onClick={() => navigate('/register')} sx={[buttonStyle, {color: 'white', mt: 2, ml: 2}]}>
                                                                Register
                                                            </Button> 
                                                        </Grid>
                                                    }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3}/>
            </Grid>
            
            <BackButton />
            <InputModal keybinds={keybinds} setKeybinds={setKeybinds} open={modal} toggleModal={toggleModal} inputKey={currInput} />
        </div>
    );
}

function InputModal(props) {
    const {keybinds, setKeybinds} = props;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    // chatgpt a real one for this
    useEffect(() => {
        const handleKeyPress = (event) => {
            const currKey = (event.key === ' ') ? 'SPACE' : event.key.toUpperCase();
            if(props.inputKey === 'Up') {
                setKeybinds({
                    UP: currKey,
                    LEFT: keybinds.LEFT,
                    DOWN: keybinds.DOWN,
                    RIGHT: keybinds.RIGHT,
                    INTERACT: keybinds.INTERACT
                })
            }
            if(props.inputKey === 'Left') {
                setKeybinds({
                    UP: keybinds.UP,
                    LEFT: currKey,
                    DOWN: keybinds.DOWN,
                    RIGHT: keybinds.RIGHT,
                    INTERACT: keybinds.INTERACT
                })
            }
            if(props.inputKey === 'Down') {
                setKeybinds({
                    UP: keybinds.UP,
                    LEFT: keybinds.LEFT,
                    DOWN: currKey,
                    RIGHT: keybinds.RIGHT,
                    INTERACT: keybinds.INTERACT
                })
            }
            if(props.inputKey === 'Right') {
                setKeybinds({
                    UP: keybinds.UP,
                    LEFT: keybinds.LEFT,
                    DOWN: keybinds.DOWN,
                    RIGHT: currKey,
                    INTERACT: keybinds.INTERACT
                })
            }
            if(props.inputKey === 'Interact') {
                setKeybinds({
                    UP: keybinds.UP,
                    LEFT: keybinds.LEFT,
                    DOWN: keybinds.DOWN,
                    RIGHT: keybinds.RIGHT,
                    INTERACT: currKey
                })
            }
            props.toggleModal();
        };

        // Attach event listener when modal is open, remove it when it is closed
        if(props.open) document.addEventListener('keydown', handleKeyPress);
        else document.removeEventListener('keydown', handleKeyPress);

        // Clean up the event listener when component unmounts
        return () => document.removeEventListener('keydown', handleKeyPress);
        //eslint-disable-next-line
    }, [props.open]);

    return (
        <Modal id={`${props.inputKey}-input`} open={props.open} onClose={props.toggleModal}>
            <Box sx={style}>
                <h1>Enter Input for {props.inputKey}</h1>
            </Box>
        </Modal>
    )
}

function InputField(props) {
    const {auth, id, setCurrInput, toggleModal, keybinds, keybindControl, inputStr, inputKey} = props;
    return (
        <>
            <Grid item xs={6}>{inputStr}</Grid>
            <Button id={id} xs={6} onClick={() => {
                if(auth.role === UserRoleType.GUEST) return;
                setCurrInput(`${inputStr}`);
                toggleModal();
            }}>
                {auth.role === UserRoleType.GUEST ? `${inputKey}` : keybinds && keybindControl}
            </Button>
        </>
    )
}