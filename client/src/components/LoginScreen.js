import { Avatar, Box, Button, CssBaseline, Grid, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useContext, useState } from 'react';
import AuthContext from '../auth';
import BackButton from './BackButton';
import { useNavigate } from 'react-router-dom';
import { buttonStyle } from '../Styles';

export default function LoginScreen() {
    const {auth} = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordVerify: ''
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        auth.loginUser(
            formData.email,
            formData.password
        );
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value })
    }

//    let modal = "";
//    if(auth.errorMessage !== "") modal = <MUIErrorModal auth={auth} />;

    return (
            <Box sx={{
                height: '90%',
                width: '100%',
                flexDirection: 'column',
                backgroundColor: 'white',
                position: 'absolute',
                textAlign: 'center',
                top: '5%',
                p: 2,
                boxShadow: 10
            }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            id="loginSubmit"
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={[buttonStyle, { mt: 3, mb: 2 }]}
                        >
                            Login
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link onClick={() => navigate('/register')} variant="body2">
                                    Don't have an account? Sign Up
                                </Link>
                                <Link onClick={() => navigate('/register')} variant="body2">
                                    Forgot Password?
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                    {/* {modal} */}
                </Box>
                <BackButton />
            </Box>
    );
}