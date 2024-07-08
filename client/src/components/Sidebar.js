import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthContext from '../auth';
import { useContext, useEffect, useState } from 'react';
import GlobalStoreContext from '../store';
import ReportModal from './ReportModal';
import { api } from '../store/store-request-api';
import SocketEvents from '../constants/socketEvents';
import socket from '../constants/socket';

// This defines the structure of a user being rendered in the sidebar. - Torin
class Member {
    constructor(id, username, profilePicture) {
        this.id = id
        this.username = username
        this.profilePicture = profilePicture
    }
}

export default function Sidebar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [showReportModal, setShowReportModal] = useState(false);
    const [clickedUser, setClickedUser] = useState('');
    if(clickedUser); // Will implement later
    const [party, setParty] = useState([]); // an array of Member objects

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    function handleLeaveParty() {
        
        // Filter out the current user from the party
        let newParty = store.partyMembers.filter(user => user.username !== auth.username).map(user => user.username);
        
        // .filter returns a single element without it being in an array if it's only one element
        // filtered. So, I had to do this so that newParty is maintained as an array
        if (!Array.isArray(newParty))
            newParty = [newParty]

        // Update everyone with the new party without the current user
        socket.emit(SocketEvents.LEAVE_PARTY, {
            partyMembers: newParty
        })

        // User is now in a party by himself sadge
        store.updateParty({
            partyMembers: [auth.username],
        })
    }

    function handlePrivateMessaging(event) {
        // store.openPrivateMessaging(event);
        handleMenuClose();
    }

    function handleAddFriend(event) {
        store.sendFriend(event);
        handleMenuClose();
    }

    function handleReportPlayer(event) {
        setShowReportModal(true);
        handleMenuClose();
    }

    useEffect(() => {
        // Given the users in partyMembers, fetch each of their profile picture and _id and store them appropriately in
        // this component's state
        console.log(store.partyMembers)
        async function asyncUpdateParty() {
            const members = []
            for (let member of store.partyMembers) {
                try {
                    const response = await api.get(`/party/${member.username}`)
                    const {id, username, profilePicture} = response.data
                    
                    if (response.status === 200)
                        members.push(new Member(id, username, profilePicture))

                } catch (err) {
                    console.log(err)
                }
            }

            setParty(members)
        }
        asyncUpdateParty()
        
    }, [store.partyMembers])

    useEffect(() => {

        // When a member of the party says he's ready, update the party with data, the new party structure 
        socket.on(SocketEvents.CHANGE_READY, (data) => {
            store.changeReady(data)
        })
        //eslint-disable-next-line
    }, [])

    const partyMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <Typography variant="h6" align="center" component="div" sx={{ fontWeight: 'medium'}}>
                {clickedUser.username}
            </Typography>
            <MenuItem onClick={(event) => {handlePrivateMessaging(event)}}>
                Private Message
            </MenuItem>
            <MenuItem onClick={(event) => {handleAddFriend(event)}}>
                Add Friend
            </MenuItem>
            <MenuItem onClick={(event) => {handleReportPlayer(event)}}>
                Report Player
            </MenuItem>
        </Menu>
    );

    return (
            <Box id='sidebar' sx={{ 
                backgroundColor: '#104c00',
                flexGrow: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                right: '0%'
            }}
            >
                {party.map((user, index) => (
                    <PartyMember user={user} key={index} onClick={(event) => {
                        setClickedUser(user);
                        handleProfileMenuOpen(event);
                    }} marginTop={(index * 50) + 10 + 'px'} />
                ))}
                
                {store.partyMembers.length > 1 && 
                    <IconButton onClick={()=>{handleLeaveParty()}} sx={{
                        position: 'fixed',
                        bottom: '2%',
                        color: 'white'
                    }}>
                        <LogoutIcon />
                    </IconButton>
                }
                {clickedUser.username !== auth.username && partyMenu}
                <ReportModal open={showReportModal} onClose={() => setShowReportModal(false)} />
            </Box>
    );
}

function PartyMember(props) {
    const { store } = useContext(GlobalStoreContext);

    const { user } = props;
    console.log(user)
    const member = store.partyMembers.find(member => member.username === user.username)
    if(user) {
        return (
            <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={props.onClick}
                sx={{
                    position: 'absolute',
                    marginTop: props.marginTop,
                    color: 'white'
                }}
            >
                <Avatar src={user.profilePicture} />
                { member ? member.isReady && <CheckCircleIcon style={{ color: 'green', position: 'absolute', bottom: '0', right: '0' }} /> : null}
            </IconButton>
        );
    }
}