import { Box, Avatar, Grid } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { socialCard } from '../Styles';
// import { useContext, useEffect, useState } from 'react';
// import GlobalStoreContext from '../store';

export default function SocialCard(props) {
    const {friend, onClick, top, left} = props;
    const friendName = friend.username;
    const friendOnlineStatus = friend.onlineStatus;
    const friendPfp = friend.profilePicture !== '' ? convertDataUrl(friend.profilePicture) : '';

    // Converts profile picture from Base 64 data to readable URL string
    // shoutout to chatgpt for this 🙏
    function convertDataUrl(dataUrl) {
        var arr = dataUrl.split(','),
        bstr = atob(arr[arr.length - 1]),
        mime = arr[0].match(/:(.*?);/)[1];
        return 'data:' + mime + ';base64,' + btoa(bstr);
    }
    
    return (
        <Box onClick={onClick} sx={[socialCard, { top: top, left: left }]}>
            <Avatar
                src={friendPfp}
                sx={{width: 150, height: 150, margin: 'auto', marginTop: '5px' }}
            />
            <Grid container direction="row" alignItems="center">
                <Grid item>
                    <CircleIcon sx={{color: friendOnlineStatus ? 'lime' : 'lightgray', marginLeft:'10px'}} />
                </Grid>
                <Grid item>
                    <h3 style={{marginLeft: '5px'}}>{friendName}</h3>
                </Grid>
            </Grid>
        </Box>
    );
}