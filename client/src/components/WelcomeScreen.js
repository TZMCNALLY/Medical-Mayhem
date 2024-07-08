import { Box, Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../auth';
import MUIErrorModal from './MUIErrorModal';
import { splashButtonStyle } from '../Styles';

export default function WelcomeScreen() {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    // let modal = "";
    // if(auth.errorMessage !== "") modal = <MUIErrorModal auth={auth} />;

    return (
        <div id="welcome-screen">
            <Box sx={{
                top: '0%',
                height: '100%',
                width: '100%',
                position: 'absolute',
                backgroundImage: 'url("https://github.com/Isabella-Misanes/cse-332-datasets/blob/ad4555391416e53e3c3dffd89ed692dcb6c11030/Welcome_Screen.png?raw=true")',
                backgroundSize: '100%'
            }} />
            <Box sx={{
                top: '0%',
                height: '100%',
                width: '400px',
                position: 'absolute',
                backgroundColor: '#054400',
                opacity: '70%',
                boxShadow: 10,
            }} />
            <Box id="title-banner"
                sx={{
                    height: '90%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'right',
                    position: 'relative',
                    right: '5%',
                    marginTop: '4%',
                }}>
                <Typography variant="h2" gutterBottom>Medical Mayhem</Typography>
            </Box>
            <Grid container spacing={2} sx={{p: 4, position: 'absolute', bottom: '3%'}}>
                <Grid item xs={12}>
                    <Button variant="contained"
                        id = "register"
                        sx={[splashButtonStyle, {minWidth: '225px', maxWidth: '40%', left: '2%'}]}
                        onClick={() => { navigate("/register") }}>
                        Register as New User
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained"
                        sx={[splashButtonStyle, {
                            width: '225px',
                            left: '2%'
                        }]}
                        id = "login"
                        onClick={()=>{ navigate("/login") }}>
                        Log In
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained"
                        sx={[splashButtonStyle, {
                            width: '225px',
                            left: '2%'
                        }]}
                        id = "continue-as-guest"
                        onClick={()=>{ auth.loginGuest() }}>
                        Continue as Guest
                    </Button>
                </Grid>
            </Grid>
            {/* {modal} */}
        </div>
    );
}