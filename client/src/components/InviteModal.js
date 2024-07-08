import { Box, Button, Divider, Grid, Modal } from '@mui/material';
import { buttonStyle } from '../Styles';
import { useContext, useEffect, useState } from 'react';
import socket from '../constants/socket';
import SocketEvents from "../constants/socketEvents";
import GlobalStoreContext from '../store';

export default function InviteModal({displayInviteModal, setDisplayInviteModal}) {
    const { store } = useContext(GlobalStoreContext);
    const [inviter, setInviter] = useState('')

    function handleAcceptInvite(event) {
        socket.emit(SocketEvents.PARTY_INVITE_ACCEPTED, {
            inviter: inviter
        })
        setDisplayInviteModal(false)
    }  

    function handleRejectInvite(event) {
        setDisplayInviteModal(false)
    }

    useEffect(() => {
        socket.on(SocketEvents.PARTY_INVITE, (data) => {
            console.log("PARTY INVITE RECEIVED")
            console.log(store.settings.toggles.party)

            if (store.settings.toggles.party) {
                setInviter(data.inviter)
                setDisplayInviteModal(true)
            }
        })

        socket.on(SocketEvents.UPDATE_PARTY_INFO, (data) => {
            console.log('RECEIVED UPDATE PARTY INFO')
            store.updateParty({
                partyMembers: data.partyMembers,
                playerList: store.playerList
            })
        })

    //eslint-disable-next-line
    }, [store.playerList])

    return (
        <Modal
            open={displayInviteModal}
            onClose={() => setDisplayInviteModal(false)}
        >
            <Box sx={{
                width: '30%',
                height: '40%',
                bgcolor: '#4D9147',
                top: '20%',
                left: '35%',
                position: 'absolute',
                boxShadow: 10,
                textAlign: 'center',
                borderRadius: '16px',
                color: 'white'
            }}>
                <h1>Game Invitation</h1>
                <Divider />
                <Box sx={{
                    bgcolor: '#e3e3e3',
                    width: '100%',
                    height: '60%',
                    alignContent: 'center',
                    textAlign: 'center',
                    color: 'black'
                }}>
                    <p><strong>{inviter}</strong> has invited you to their party.</p>
                    <Grid container spacing={0}>
                        <Grid item xs={6}>
                            <Button sx={[buttonStyle, {color: 'white'}]}
                                onClick={(event) => {handleAcceptInvite(event)}}>
                                Accept
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button sx={{
                                bgcolor: 'red',
                                color: 'white'
                            }}
                                onClick={(event) => {handleRejectInvite(event)}}>
                                Reject
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Modal>
    );
}