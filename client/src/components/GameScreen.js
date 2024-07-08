import { Box } from '@mui/material';
import BackButton from './BackButton';
// import { Engine } from "excalibur";
import { useContext, useEffect, useRef } from "react";
import { MedicalMayhem } from '../game/medicalMayhem'
// import socket from '../constants/socket';
// import SocketEvents from '../constants/socketEvents';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';

export default function GameScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const gameCanvas = useRef(null);
	const gameRef = useRef();

    useEffect(() => {
		if (!gameRef.current && gameCanvas.current)
			MedicalMayhem(gameRef, gameCanvas, store.players, auth.username);
        //eslint-disable-next-line
	}, []);

    return (
        <div id="about-screen">
            <Box sx={{
                bgcolor: 'black',
                width: '100%',
                height: '100%',
                position: 'absolute'
            }}>
                <canvas ref={gameCanvas} id="gameCanvas"></canvas>
                {/* <Box sx={{
                    top: '5%',
                    left: '5%',
                    height: '90%',
                    width: '90%',
                    position: 'absolute',
                    backgroundImage: 'url("https://github.com/Isabella-Misanes/cse-332-datasets/blob/ad4555391416e53e3c3dffd89ed692dcb6c11030/Welcome_Screen.png?raw=true")',
                    backgroundSize: '100%'
                }}/> */}
            </Box>
            <BackButton />
        </div>
    );
}