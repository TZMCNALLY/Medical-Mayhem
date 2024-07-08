import React, { useState } from 'react';
import { Box, Button, Grid, Menu, MenuItem, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';

import BackButton from './BackButton';
import { useContext } from 'react';
import GlobalStoreContext from '../store';
import { buttonStyle } from '../Styles';

export default function LeaderBoardScreen() {
    const {store} = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    function handleSortHighestScore(event) {
        store.sortHighestScore(event);
        handleMenuClose();
    }
    function handleSortTotalScore(event) {
        store.sortTotalScore(event);
        handleMenuClose();
    }
    function handleSortGamesPlayed(event) {
        store.sortGamesPlayed(event);
        handleMenuClose();
    }
    function handleSortMinigamesPlayed(event) {
        store.sortMinigamesPlayed(event);
        handleMenuClose();
    }

    const sortMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            keepMounted
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={(event) => {handleSortHighestScore(event)}}>
                Highest Score
            </MenuItem>
            <MenuItem onClick={(event) => {handleSortTotalScore(event)}}>
                Total Score
            </MenuItem>
            <MenuItem onClick={(event) => {handleSortGamesPlayed(event)}}>
                Games Played
            </MenuItem>
            <MenuItem onClick={(event) => {handleSortMinigamesPlayed(event)}}>
                Minigames Played
            </MenuItem>
        </Menu>
    );
    
    return (
        <div className="App">
        <Box id="box-root"
            sx={{ 
            position: 'absolute',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center'
            }}
        >
            <Grid container spacing={2} sx={{
                width: '85%',
                ml: '7.5%',
                alignItems: 'center',
                pt: 2
            }}>
                <Grid item xs={6} sx={{
                    fontSize: '24px',
                }}>
                    <strong>Leaderboard</strong>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" 
                        onClick={(event) => (handleSortMenuOpen(event))}
                        sx={[buttonStyle, {
                            color: 'white',
                    }]}>
                        Sort
                        <SortIcon/>
                    </Button>
                </Grid>
            </Grid>
            <Box 
            sx={{ 
                flexGrow: 1,
                width: '100%',
                position: 'absolute'
            }}
            >
            </Box>
            <Box
            sx={{
                margin: 'auto',
                height: '85%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                minHeight: '85%',
                maxHeight: '85%'
            }}
            >
            <TableContainer sx={{
                boxShadow: 4,
                width: 'fit-content',
            }}>
                <Table
                sx={{
                    bgcolor: 'background.paper',
                    position: 'relative',
                    maxHeight: '100%',
                }}
                />
                <TableHead sx={{
                    bgcolor: '#34732F',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                }}>
                <TableRow>
                    <TableCell sx={{
                        color: 'white'
                    }}>Username</TableCell>
                    <TableCell sx={{
                        color: 'white'
                    }}>Highest Score</TableCell>
                    <TableCell sx={{
                        color: 'white'
                    }}>Total Score</TableCell>
                    <TableCell sx={{
                        color: 'white'
                    }}>Games Played</TableCell>
                    <TableCell sx={{
                        color: 'white'
                    }}>Minigames Played</TableCell>
                    <TableCell sx={{
                        color: 'white'
                    }}>Favorite Minigame</TableCell>
                </TableRow>
                </TableHead>
                <TableBody sx={{
                    bgcolor: '#E7E7E7'
                }}>

                    <TableRow>
                    <TableCell>McKillaGorilla</TableCell>
                    <TableCell>189,213</TableCell>
                    <TableCell>1,988,031</TableCell>
                    <TableCell>47</TableCell>
                    <TableCell>438</TableCell>
                    <TableCell>Medicine Matching</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>Player1</TableCell>
                    <TableCell>999,999</TableCell>
                    <TableCell>999,999,999</TableCell>
                    <TableCell>99</TableCell>
                    <TableCell>999</TableCell>
                    <TableCell>Heart Beat</TableCell>
                    </TableRow>

                    <TableRow>
                    <TableCell>McKillaGorilla</TableCell>
                    <TableCell>189,213</TableCell>
                    <TableCell>1,988,031</TableCell>
                    <TableCell>47</TableCell>
                    <TableCell>438</TableCell>
                    <TableCell>Medicine Matching</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>Player1</TableCell>
                    <TableCell>999,999</TableCell>
                    <TableCell>999,999,999</TableCell>
                    <TableCell>99</TableCell>
                    <TableCell>999</TableCell>
                    <TableCell>Heart Beat</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>McKillaGorilla</TableCell>
                    <TableCell>189,213</TableCell>
                    <TableCell>1,988,031</TableCell>
                    <TableCell>47</TableCell>
                    <TableCell>438</TableCell>
                    <TableCell>Medicine Matching</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>Player1</TableCell>
                    <TableCell>999,999</TableCell>
                    <TableCell>999,999,999</TableCell>
                    <TableCell>99</TableCell>
                    <TableCell>999</TableCell>
                    <TableCell>Heart Beat</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>McKillaGorilla</TableCell>
                    <TableCell>189,213</TableCell>
                    <TableCell>1,988,031</TableCell>
                    <TableCell>47</TableCell>
                    <TableCell>438</TableCell>
                    <TableCell>Medicine Matching</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>Player1</TableCell>
                    <TableCell>999,999</TableCell>
                    <TableCell>999,999,999</TableCell>
                    <TableCell>99</TableCell>
                    <TableCell>999</TableCell>
                    <TableCell>Heart Beat</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>McKillaGorilla</TableCell>
                    <TableCell>189,213</TableCell>
                    <TableCell>1,988,031</TableCell>
                    <TableCell>47</TableCell>
                    <TableCell>438</TableCell>
                    <TableCell>Medicine Matching</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>Player1</TableCell>
                    <TableCell>999,999</TableCell>
                    <TableCell>999,999,999</TableCell>
                    <TableCell>99</TableCell>
                    <TableCell>999</TableCell>
                    <TableCell>Heart Beat</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>McKillaGorilla</TableCell>
                    <TableCell>189,213</TableCell>
                    <TableCell>1,988,031</TableCell>
                    <TableCell>47</TableCell>
                    <TableCell>438</TableCell>
                    <TableCell>Medicine Matching</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>Player1</TableCell>
                    <TableCell>999,999</TableCell>
                    <TableCell>999,999,999</TableCell>
                    <TableCell>99</TableCell>
                    <TableCell>999</TableCell>
                    <TableCell>Heart Beat</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>McKillaGorilla</TableCell>
                    <TableCell>189,213</TableCell>
                    <TableCell>1,988,031</TableCell>
                    <TableCell>47</TableCell>
                    <TableCell>438</TableCell>
                    <TableCell>Medicine Matching</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>Player1</TableCell>
                    <TableCell>999,999</TableCell>
                    <TableCell>999,999,999</TableCell>
                    <TableCell>99</TableCell>
                    <TableCell>999</TableCell>
                    <TableCell>Heart Beat</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>McKillaGorilla</TableCell>
                    <TableCell>189,213</TableCell>
                    <TableCell>1,988,031</TableCell>
                    <TableCell>47</TableCell>
                    <TableCell>438</TableCell>
                    <TableCell>Medicine Matching</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>Player1</TableCell>
                    <TableCell>999,999</TableCell>
                    <TableCell>999,999,999</TableCell>
                    <TableCell>99</TableCell>
                    <TableCell>999</TableCell>
                    <TableCell>Heart Beat</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>McKillaGorilla</TableCell>
                    <TableCell>189,213</TableCell>
                    <TableCell>1,988,031</TableCell>
                    <TableCell>47</TableCell>
                    <TableCell>438</TableCell>
                    <TableCell>Medicine Matching</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>Player1</TableCell>
                    <TableCell>999,999</TableCell>
                    <TableCell>999,999,999</TableCell>
                    <TableCell>99</TableCell>
                    <TableCell>999</TableCell>
                    <TableCell>Heart Beat</TableCell>
                    </TableRow>


                </TableBody>
            </TableContainer>
            </Box>
        </Box>
        {sortMenu}
        
        <BackButton />
        </div>
    );
}