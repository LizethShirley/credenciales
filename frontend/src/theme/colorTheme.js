import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";


export const colorTheme = createTheme({
    palette:{
        primary:{
            main:'#7C7C7C'
        },
        secondary:{
            main:'#CCB347'
        },
        error:{
            main:red.A400
        },
        background: {
            default: '#FAFAFA',
            paper: '#F7F7F7'
        },
        typography:{
            fontFamily: 'Roboto, sans-serif',
        }
    }
})