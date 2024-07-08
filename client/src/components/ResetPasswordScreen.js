import { Avatar, Box, Button, CssBaseline, Grid, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useContext, useState } from 'react';
import AuthContext from '../auth';
import { useParams } from 'react-router-dom';

export default function ResetPasswordScreen(props) {
    const {auth} = useContext(AuthContext);
    
    const [formData, setFormData] = useState({
        token: useParams().token,
        password: '',
        passwordVerify: ''
    })

    const handleSubmit = (event) => {
        event.preventDefault();

        auth.resetPassword(
            formData.token,
            formData.password,
            formData.passwordVerify
        );
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value })
    }
    
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
                        Reset Password
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
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
                                    sx={{width: '50%'}}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="passwordVerify"
                                    label="Verify Password"
                                    type="password"
                                    id="passwordVerify"
                                    autoComplete="new-password"
                                    onChange={handleChange}
                                    sx={{width: '50%'}}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            id="loginSubmit"
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Reset Password
                        </Button>
                    </Box>
                    {/* {modal} */}
                </Box>
            </Box>
    );
}