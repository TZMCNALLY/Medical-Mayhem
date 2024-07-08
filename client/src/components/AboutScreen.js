import { Divider, Grid } from '@mui/material';
import BackButton from './BackButton';
import { innerContentBox, outerContentBox } from '../Styles';

export default function AboutScreen() {
    return (
        <div id="about-screen">
            <Grid container>
                <Grid item xs={3}/>
                <Grid item xs={6}>
                    <Grid container sx={outerContentBox}>
                        <Grid item xs={10}>
                            <Grid container sx={innerContentBox}>
                                <Grid item xs={12}>
                                    <h1>About Screen</h1>
                                    <Divider />
                                    <h3>Medical Mayhem is a top down 2-D multiplayer game created by:</h3>
                                        <h4>Thomas Aloi</h4>
                                        <h4>Torin McNally</h4>
                                        <h4>Isabella Misanes</h4>
                                        <h4>Jared Tjahjadi</h4>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3}/>
            </Grid>
            
            <BackButton />
        </div>
    );
}