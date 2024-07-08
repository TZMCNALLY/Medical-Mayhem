import { Button } from '@mui/material';
import { buttonStyle } from '../Styles';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
    const navigate = useNavigate();
    return (
        <Button id='back-button' variant="contained"
            sx={[buttonStyle, {left: '2%', bottom: '7%', position: 'absolute'}]}
            onClick={()=>{navigate("/")}}>
            Back
        </Button>
    )
}