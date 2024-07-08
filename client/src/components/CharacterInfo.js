import { Button, Divider, Grid, List, ListItem, ListItemText, TextField } from '@mui/material';
import { buttonStyle, commList, commentCard } from '../Styles';
import { useState, useContext, useEffect, useRef } from 'react';
import GlobalStoreContext from '../store';

export default function CharacterInfo(props) {
    const {store} = useContext(GlobalStoreContext);
    const [commentText, setCommentText] = useState("");
    const [view, setView] = useState([]);
    const commentRef = useRef(null);
    
    const avatar = props.avatar;
    const avatarPic = avatar.avatarSprite !== '' ? convertDataUrl(avatar.avatarSprite) : '';

    useEffect(() => {
        store.loadAvatar(avatar._id);
        return () => {
            setView([]);
        };
        // eslint-disable-next-line
    }, [avatar])

    useEffect(() => {
        if (store.avatarView && store.avatarView && store.avatarView.comments.length > 0) {
            setView(store.avatarView.comments);
        } else {
            setView([]);
        }
        // eslint-disable-next-line
    }, [store.avatarView])

    useEffect(() => {
        if(commentRef.current) commentRef.current.scrollTop = commentRef.current.scrollHeight;
    }, [view])

    function convertDataUrl(dataUrl) {
        var arr = dataUrl.split(','),
        bstr = atob(arr[arr.length - 1]),
        mime = arr[0].match(/:(.*?);/)[1];
        return 'data:' + mime + ';base64,' + btoa(bstr);
    }

    function handleSubmitComment() {
        store.addComment(commentText, avatar);
        store.loadAvatar(avatar._id);
        setCommentText("");
    }

    const showComments = (
        view.map((comment, index) => (
            <div key={index} id={"comment-card-" + index}>
                <ListItem key={index} sx={commentCard}>
                    <ListItemText key={index} primary={comment.text} secondary={"- " + comment.senderUsername}/>
                </ListItem>
                <Divider />
            </div>
        ))
    );
    
    return (
        <div id="character-card">
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <h3>{avatar.avatarName}</h3>
                </Grid>
                <Grid item container spacing={1} xs={12}>
                    <Grid item xs={4}>
                        <img 
                            src={avatarPic}
                            width={150}
                            height={150}
                            alt=''
                        />
                    </Grid>
                    <Grid item xs={8} sx={{ textAlign: 'left' }}>
                            Created by: <strong>{avatar.author}</strong><br/>
                            Speed: <strong>{avatar.speed}</strong><br/>
                            Strength: <strong>{avatar.strength}</strong><br/>
                            Defense: <strong>{avatar.defense}</strong><br/>
                            Favorite Minigame: <strong>{avatar.favoredMinigame}</strong>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                    <h4>Comments</h4>
                </Grid>

                <Grid item xs={1}/>
                <Grid item xs={10}>
                    <List ref={commentRef} sx={commList}>
                        {view.length === 0 ? (
                            <div>No comments.</div>
                        ) : showComments}
                    </List>
                </Grid>
                <Grid item xs={1}/>

                <Grid item xs={1}/>
                <Grid item xs={10}>
                    <TextField fullWidth label='Comment' 
                    onChange={(event) => {setCommentText(event.target.value)}}/>
                </Grid>
                <Grid item xs={12}>
                    <Button sx={buttonStyle}
                        onClick={() => {handleSubmitComment()}}>
                        Send Comment
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}