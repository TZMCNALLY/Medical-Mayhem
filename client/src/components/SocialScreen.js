import { Box, Button, Divider, Grid, Modal, Typography, TextField } from '@mui/material';
import { buttonStyle } from '../Styles';

import GlobalStoreContext from '../store';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { ReportModal, BackButton } from '.';
import SocialCard from './SocialCard';
import MUIErrorModal from './MUIErrorModal';
import UserOptionMenu from './UserOptionMenu';

export default function SocialScreen({toggleDrawer}) {
    const { store } = useContext(GlobalStoreContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [activeButton, setActiveButton] = useState(0);
    const [playerList, setPlayerList] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [showReportModal, setShowReportModal] = useState(false);
    const [currFriend, setCurrFriend] = useState('');
    // Add friend modal functionality
    const [addFriendUsername, setAddFriendUsername] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);

    function handleButtonClick(buttonId) { setActiveButton(buttonId); };

    const [id, setId] = useState('');
    useEffect(() => {
        switch(activeButton) {
            case 0:
                store.viewFriends();
                setId('friends');
                break;
            case 1:
                store.showRecentPlayers();
                setId('recent-players');
                break;
            case 2:
                store.showSentRequests();
                setId('sent-requests');
                break;
            case 3:
                store.showReceivedRequests();
                setId('received-requests');
                break;
            case 4:
                store.getOnlinePlayers();
                setId('online-users');
                break;
            default:
                // store.viewFriends();
                // break;
        }
        // Having the below dependency as [activeButton, store] causes it to spam
        // eslint-disable-next-line
    }, [activeButton]);

    useEffect(() => {
        // Checking if store.profileInfo.friends exists fixes the error of the friends state being undefined upon load
        setPlayerList(store.playerList ? store.playerList : [])
    }, [store.playerList])

    function handleFriendModalOpen() {
        setAddFriendUsername('');
        setModalOpen(true);
    }
    function handleFriendModalClose() { setModalOpen(false); }

    const renderButton = (buttonNum, str) => {
        return (
            <Button
                id={str.toLowerCase().replace(/\s+/g, '-') + '-button'}
                onClick={() => {handleButtonClick(buttonNum)}}
                sx={{color: activeButton === buttonNum ? 'red' : 'black'}}
            >
                {str}
            </Button>
        )
    };

    const handleProfileMenuOpen = (event) => { setAnchorEl(event.currentTarget); };
    
    // TODO: Handle having more than 10 players on the page
    const playerRender = () => {
        const playerCards = [];
        let str = 'No ';
        if(activeButton === 0) str += 'Friends';
        else if(activeButton === 1) str += 'Recent Players';
        else if(activeButton === 2) str += 'Sent Friend Requests';
        else if(activeButton === 3) str += 'Received Friend Requests';
        else str += 'Online Users';
        
        if(playerList.length !== 0) {
            // TODO: Arbitrarily limited max # of displayed users to 10 but have to figure out how to display more than 10 later
            for(let i = 0; i < playerList.length && i < 10; i++) {
                playerCards.push(
                    <SocialCard
                        key={i}
                        top={`${25 + Math.floor(i / 5) * 32.5}%`}
                        left={`${5 + ((i % 5) * 17.5)}%`}
                        friend={playerList[i]}
                        onClick={(event) => {
                            setCurrFriend(playerList[i].username);
                            handleProfileMenuOpen(event);
                        }}
                    />
                )
            }
        }
        else {
            playerCards.push(
                <Box
                    id={str.toLowerCase().replace(/\s+/g, '-')}
                    key={'no-players'}
                    sx={{
                        width: '90%',
                        height: '40%',
                        bgcolor: 'white',
                        position: 'absolute',
                        top: '30%',
                        left: '5%',
                        boxShadow: 5
                    }}
                >
                    <h1>{str}</h1>
                </Box>
            )
        }
        return playerCards;
    }

    // Add friend
    const handleSubmit = (event) => {
        event.preventDefault();
        store.sendFriend(addFriendUsername, handleFriendModalClose, setConfirmModal, activeButton);
    };

    const handleAddFriendUsernameChange = (event) => {
        event.preventDefault();
        setAddFriendUsername(event.target.value);
    }

    let modal = store.errorMessage === "" ? null : <MUIErrorModal id={'error'} store={store} />;
    
    return (
        <div id="social-screen">
            <Box sx={{
                height: '85%',
                width: '85%',
                flexDirection: 'column',
                backgroundColor: '#626262',
                position: 'absolute',
                textAlign: 'center',
                top: '5%',
                left: '2.5%',
                p: 2,
                boxShadow: 10
            }} />
            <Box
                sx={{
                    height: '80%',
                    width: '82.5%',
                    flexDirection: 'column',
                    backgroundColor: '#BA7943',
                    position: 'absolute',
                    textAlign: 'center',
                    top: '7.5%',
                    left: '3.75%',
                    p: 2,
                    // marginRight: '10%',
            }}>
                {/*
                    TODO: Fix UI issues:
                    Grid container doesn't take up full box width (appears fine but see inspect element menu)
                    Grid item elements within container go outside of the grid container width/height
                 */}
                <Grid container spacing={2}>
                    <Grid item xs={2} sx={{
                        bgcolor: 'white',
                        m: 2,
                        pr: 2,
                        width: 'fit-content',
                        height: 'fit-content',
                        boxShadow: 5
                    }}>
                        <Typography variant="h4" gutterBottom>Social</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{mt: 2}}>
                        <Button
                            id='add-friend'
                            variant='contained' 
                            sx={buttonStyle}
                            onClick={handleFriendModalOpen}
                        >
                            Add Friend
                        </Button>
                    </Grid>
                    <Grid item xs={1}>
                        <Box sx={{
                            bgcolor: 'white',
                            mt: 2,
                            mb: 2,
                            ml: 14,
                            textAlign: 'center',
                            boxShadow: 5,
                            width: 'fit-content',
                            position: 'absolute'
                        }}>
                            {renderButton(4, "Online Users")}
                        </Box>
                    </Grid>
                    <Grid item xs={3} />
                    <Grid item xs={3}>
                        <Box sx={{
                            bgcolor: 'white',
                            mt: 2,
                            mb: 2,
                            ml: 14,
                            textAlign: 'center',
                            boxShadow: 5,
                            width: 'fit-content',
                            position: 'absolute'
                        }}>
                            {renderButton(0, "Friends")}
                            /
                            {renderButton(1, "Recent Players")}
                        </Box>
                        
                        <br />
                        <Box sx={{
                            bgcolor: 'white',
                            mt: 6,
                            mb: 2,
                            ml: 23,
                            textAlign: 'center',
                            boxShadow: 5,
                            width: 'fit-content',
                            position: 'absolute',
                            fontSize: '12px',
                        }}>
                            {renderButton(2, "Sent")}
                            /
                            {renderButton(3, "Received")}
                        </Box>
                    </Grid>
                </Grid>

                <Box id={id} sx={{height: 100}}>
                    {playerRender()}
                </Box>
                
                <BackButton />

                <AddFriendModal
                    isModalOpen={isModalOpen}
                    handleFriendModalClose={handleFriendModalClose}
                    handleSubmit={handleSubmit}
                    handleAddFriendUsernameChange={handleAddFriendUsernameChange}
                    modal={modal}
                />
                <ConfirmModal
                    confirmModal={confirmModal}
                    handleModalClose={() => setConfirmModal(false)}
                    username={isModalOpen ? addFriendUsername : currFriend}
                />
                {isMenuOpen && <UserOptionMenu
                    anchorEl={anchorEl}
                    setAnchorEl={setAnchorEl}
                    isMenuOpen={isMenuOpen}
                    targetUser={currFriend}
                    setShowReportModal={setShowReportModal}
                    handleFriendModalClose={handleFriendModalClose}
                    setConfirmModal={setConfirmModal}
                />}
                <ReportModal open={showReportModal} onClose={() => setShowReportModal(false)} />
            </Box>
            
        </div>
    );
}

function AddFriendModal(props) {
    return (
        <Modal id={'add-friend-modal'} open={props.isModalOpen} onClose={props.handleFriendModalClose}>
            <Box sx={{
                width: '30%',
                height: '27%',
                bgcolor: '#2d7044',
                border: 1,
                borderColor: 'white',
                top: '20%',
                left: '30%',
                position: 'absolute',
                boxShadow: 5,
                textAlign: 'center',
            }}>
                <h1>Add Friend</h1>
                <Divider />
                <Box component='form' noValidate onSubmit={props.handleSubmit}>
                    <TextField
                        id='username'
                        size='small'
                        // value={username}
                        fullWidth
                        label='Enter Username'
                        variant="filled"
                        sx={{bgcolor: '#e3e3e3', width: '90%', mt: '5%'}}
                        onChange={props.handleAddFriendUsernameChange}
                    />
                    <Button
                        id="add-friend-submit"
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, width: '50%' }}
                    >
                        Add Friend
                    </Button>
                </Box>
                {props.modal}
            </Box>
        </Modal>
    )
}

function ConfirmModal(props) {
    return (
        <Modal id={'confirm-modal'} open={props.confirmModal} onClose={props.handleModalClose}>
            <Box sx={{
                width: '30%',
                height: '27%',
                bgcolor: '#2d7044',
                border: 1,
                borderColor: 'white',
                top: '20%',
                left: '30%',
                position: 'absolute',
                boxShadow: 5,
                textAlign: 'center',
            }}>
                <h1>Friend request sent to user {props.username}.</h1>
            </Box>
        </Modal>
    )
}