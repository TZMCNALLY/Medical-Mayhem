import { Menu, MenuItem, Typography } from "@mui/material";
import GlobalStoreContext from "../store";
import { useContext, useEffect, useState } from "react";
import socket from "../constants/socket";
import SocketEvents from "../constants/socketEvents";
import AuthContext from "../auth";
import { useNavigate } from "react-router-dom";

export default function UserOptionMenu(props) {
    const {targetUser, anchorEl, setAnchorEl, isMenuOpen, setShowReportModal, handleFriendModalClose, setConfirmModal} = props;
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const navigate = useNavigate();
    const [relationToUser, setRelationToUser] = useState(null);

    useEffect(() => { if(targetUser) store.getRelationToUser(targetUser); //eslint-disable-next-line
    }, [targetUser])

    useEffect(() => {setRelationToUser(store.relation)}, //eslint-disable-next-line
        [store.relation])

    const handleMenuClose = () => { setAnchorEl(null); };

    function handleViewProfile(event) {
        handleMenuClose();
        navigate('/profile', {state: {currUsername: targetUser}});
    }

    function handlePrivateMessaging(event) {
        store.openPrivateMessaging(event);
        handleMenuClose();
    }

    function handleInviteToParty(event) {

        if (store.partyMembers.length === 4)
            store.error('The party is already at max 4 users.')

        else {
            socket.emit(SocketEvents.PARTY_INVITE, {
                inviter: auth.username, // this user's username
                receiver: targetUser // the friend's username
            })
        }

        handleMenuClose();
    }

    // TODO: Display modal to confirm user wants to remove friend
    // TODO: Handle friend list updating once user removes friend (i dread dealing with useEffect tho...)
    function handleRemoveFriend() {
        store.removeFriend(targetUser);
        handleMenuClose();
    }

    function handleCancelRequest() {
        store.cancelFriendRequest(targetUser);
        handleMenuClose();
    }

    function handleIgnoreRequest() {
        store.ignoreFriendRequest(targetUser);
        handleMenuClose();
    }

    function handleAcceptRequest() {
        store.acceptFriendRequest(targetUser);
        handleMenuClose();
    }

    function handleReportPlayer() {
        setShowReportModal(true);
        handleMenuClose();
    }

    function handleBlockPlayer() {
        store.blockPlayer(targetUser);
        handleMenuClose();
    }

    let optionStr = () => {
        if(relationToUser === 'FRIENDS') return 'Remove Friend';
        else if(relationToUser === 'SENT') return 'Cancel Friend Request';
        else if(relationToUser === 'BLOCKED') return 'Unblock User';
        else if(relationToUser === 'RECEIVED') return 'Ignore Friend Request';
        else return 'Add Friend';
    }
    
    const acceptRequestItem = (
        <MenuItem onClick={() => handleAcceptRequest(targetUser)}>
            Accept Friend Request
        </MenuItem>
    )
    
    return (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            keepMounted
            transformOrigin={{vertical: 'top',horizontal: 'right'}}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <Typography variant="h6" align="center" component="div" sx={{ fontWeight: 'medium'}}>
                {targetUser}
            </Typography>
            <MenuItem onClick={(event) => {handleViewProfile(event)}}>
                View Profile
            </MenuItem>
            <MenuItem onClick={(event) => {handlePrivateMessaging(event)}}>
                Private Message
            </MenuItem>
            <MenuItem onClick={(event) => {handleInviteToParty(event)}}>
                Invite to Party
            </MenuItem>
            {relationToUser === 'RECEIVED' && acceptRequestItem}
            <MenuItem onClick={() => {
                if(relationToUser === 'FRIENDS') handleRemoveFriend();
                else if(relationToUser === 'SENT') handleCancelRequest();
                else if(relationToUser === 'RECEIVED') handleIgnoreRequest(targetUser);
                else if(relationToUser === 'BLOCKED') console.log('blocked');
                else {
                    store.sendFriend(targetUser, handleFriendModalClose, setConfirmModal);
                    handleMenuClose();
                }
            }}>
                {optionStr()}
            </MenuItem>
            <MenuItem onClick={handleReportPlayer}>Report Player</MenuItem>
            {relationToUser !== 'BLOCKED' && <MenuItem onClick={handleBlockPlayer}>Block Player</MenuItem>}
        </Menu>
    );
}