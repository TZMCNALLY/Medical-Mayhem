import { Avatar, Box, Button, CssBaseline, Grid, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useContext, useState } from 'react';
import AuthContext from '../auth';
import BackButton from './BackButton';
import { buttonStyle } from '../Styles';

export default function ForgotPasswordScreen() {
    const {auth} = useContext(AuthContext);
    
    const [formData, setFormData] = useState({
        email: '',
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        auth.forgotPassword(
            formData.email
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
                        Forgot Password
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
                        </Grid>
                        <Button
                            id="loginSubmit"
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={[buttonStyle, { mt: 3, mb: 2 }]}
                        >
                            Reset Password
                        </Button>
                    </Box>
                    {/* {modal} */}
                </Box>
                <BackButton />
            </Box>
    );
}