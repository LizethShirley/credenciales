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
            paper: '#FBCC00'
        },
        typography:{
            fontFamily: 'Roboto, sans-serif',
        }
    }
})