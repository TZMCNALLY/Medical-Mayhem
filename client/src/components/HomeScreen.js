import { Box, Button, Grid, Modal, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import ReportModal from './ReportModal';
import MessagesDrawer from './MessagesDrawer';
import AuthContext, { UserRoleType } from '../auth';
import SocketEvents from '../constants/socketEvents'
import loading from '../assets/loading.gif'
import socket from '../constants/socket';
import { homeScreen } from '../Styles';
import GlobalStoreContext from '../store';
import { homeButtons, modalStyle } from '../Styles';

export default function HomeScreen() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [showReportModal, setShowReportModal] = useState(false);
    const [queueingUp, setQueueingUp] = useState(false);
    const [role, setRole] = useState(UserRoleType.GUEST);

    function handlePlayButtonClick() {
        setQueueingUp(true)

        // The user will queue up by themselves if they're alone
        if (store.partyMembers.length <= 1)
            socket.emit(SocketEvents.QUEUE_UP, auth.username)

        // The user will ready up with the party, received in Sidebar.js
        else {
            console.log(store.partyMembers)

            // Ready up the current user
            const members = store.partyMembers.map(member => {
                if (member.username === auth.username)
                    member.readyUp()

                return member
            })

            // If everyone is ready, tell everyone in the party that we are all ready,
            // sending back usernames of everyone in the party
            if (members.every(member => member.isReady === true)) {

                socket.emit(SocketEvents.MATCH_FOUND, {
                    players: members.map(member => member.username)
                })

                // Unready everyone after they join game
                socket.emit(SocketEvents.CHANGE_READY, {
                    partyMembers: members.map(member => {
                        member.unready()
                        return member
                    })
                })
            }

            // Otherwise, send the new party structure with the current user ready
            else {
                socket.emit(SocketEvents.CHANGE_READY, {
                    partyMembers: members
                })
            }
        }
    }

    useEffect(() => {
        socket.emit(SocketEvents.SET_USERNAME, auth.username)

        socket.on(SocketEvents.MATCH_FOUND, (data) => {
            
            // Make sure to turn off event listeners before navigating to different
            // screens in order to avoid unexpected behaviors
            console.log(data)
            socket.off(SocketEvents.MATCH_FOUND)

            // TODO: UNREADY EVERYONE IN THE PARTY AFTER THE MATCH IS FOUND

            store.updatePlayers(data)
            console.log(store.players)
            navigate('/game')
        })

        // eslint-disable-next-line
    }, [])

    // TODO: For some reason when switching from guest user to admin user, the role is set to 'USER' and doesn't update until refresh.
    // Evident by the report button not appearing when logging out of guest user and logging into an admin user.
    useEffect(() => setRole(auth.role), [auth]);

    return (
        <div id="home-screen">
            <Grid container>
                <Grid item xs={1}/>
                <Grid item xs={6}>
                    <Grid container id="home-menu" sx={[homeScreen, {boxShadow: 4}]}>
                        <Grid item xs={12}>
                            <Typography variant="h2" color="red">Medical Mayhem</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <HomeButton
                                xs={12} id='play-button'
                                gridSx={{textAlign: 'center'}}
                                buttonSx={[homeButtons, {fontSize: '24pt'}]}
                                // onClick={() => navigate('/game')}
                                onClick={handlePlayButtonClick}
                                text='Play'
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <HomeButton
                                gridSx={{textAlign: 'center'}}
                                id='character-search-button'
                                onClick={() => navigate('/charactersearch')}
                                text='Character Search'
                                buttonSx={homeButtons}
                                disable={auth.role === UserRoleType.GUEST}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <HomeButton
                                id='character-builder-button'
                                onClick={() => navigate('/characterbuilder')}
                                backgroundColor='transparent'
                                buttonSx={{color: auth.role === UserRoleType.GUEST ? 'grey.300' : 'black'}}
                                text='Character Builder'
                                disable={auth.role === UserRoleType.GUEST}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <HomeButton
                                gridSx={{textAlign: 'center'}}
                                id='social-button'
                                onClick={() => navigate('/social')}
                                buttonSx={{color: auth.role === UserRoleType.GUEST ? 'grey.300' : 'black'}}
                                text='Social'
                                disable={auth.role === UserRoleType.GUEST}
                            />
                        </Grid>
                        {/* <Grid item xs={6}>
                            <HomeButton
                                id='forums-button'
                                onClick={() => navigate('/forum')}
                                text='Forums'
                                buttonSx={homeButtons}
                            />
                        </Grid> */}
                        <Grid item xs={6}>
                            <HomeButton
                                gridSx={{textAlign: 'center'}}
                                id='profile-button'
                                onClick={() => navigate('/profile', {state: {currUsername: auth.username}})}
                                buttonSx={{color: auth.role === UserRoleType.GUEST ? 'grey.300' : 'black'}}
                                text='Profile'
                                disable={auth.role === UserRoleType.GUEST}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <HomeButton
                                id='settings-button'
                                onClick={() => navigate('/settings')}
                                text='Settings'
                                buttonSx={homeButtons}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <HomeButton
                                gridSx={{textAlign: 'center'}}
                                id='about-button'
                                onClick={() => navigate('/about')}
                                text='About'
                                buttonSx={homeButtons}
                            />
                        </Grid>
                        {/* { role === UserRoleType.ADMIN &&
                            <Grid item xs={6}>
                                <HomeButton
                                    onClick={() => navigate("/reports")}
                                    buttonSx={[buttonStyle, {color: 'white'}]}
                                    text='Reports'
                                />
                            </Grid>
                        } */}
                        <Grid item xs={12}/>
                        <Grid item xs={12}/>
                    </Grid>                
                </Grid>
            </Grid>
            {/* <MessagesDrawer /> */}
            {role !== UserRoleType.GUEST && <MessagesDrawer />}
            {queueingUp && <QueueModal queuingUp={queueingUp} setQueueingUp={setQueueingUp}/>}
            <ReportModal reportedUser={''} open={showReportModal} onClose={() => setShowReportModal(false)} />
        </div>
    )
}

function HomeButton(props) {
    const {xs, gridSx, id, onClick, buttonSx, disable, text} = props;
    return (
        <Grid item xs={xs} sx={gridSx}>
            <Button id={id} onClick={onClick} sx={buttonSx} disabled={disable}>
                {text}
            </Button>
        </Grid>
    )
}

function QueueModal(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const modalText = store.partyMembers.length > 1 ? "Waiting for party to play..." : "Searching for other players..."
    // const [modalText, setModalText] = useState("Waiting for another player...")
    // const [matchFound, setMatchFound] = useState(false)

    function handleXButtonClick() {
        props.setQueueingUp(false)

        if (store.partyMembers.length <= 1)
            socket.emit(SocketEvents.LEAVE_QUEUE)

        // The user will stop being ready, received in Sidebar.js
        else {
            
            const members = store.partyMembers.map(member => {
                if (member.username === auth.username)
                    member.unready()

                return member
            })

            socket.emit(SocketEvents.CHANGE_READY, {
                partyMembers: members
            })
        }
    }

    return (
        <Modal
            open={props.queuingUp}
            aria-labelledby="modal-find-game"
            id="queue-modal"
        >
            <Box sx={modalStyle}>
                <Button sx={{color: 'black', ":hover":{bgcolor: '#f1f9f4'}}} onClick={handleXButtonClick}>
                    X
                </Button>
                <br />
                <Typography id="modal-find-game" variant="h6" component="h2">
                    {modalText}
                </Typography>
                {/* {matchFound ? (
                    countdownModal
                ) : ( */}
                    <img src={loading} alt='loading-gif' className="image"></img>
                {/* )} */}
            </Box>
        </Modal>
    )
}