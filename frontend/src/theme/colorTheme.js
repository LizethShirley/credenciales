import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";


export const colorTheme = createTheme({
    palette:{
        primary:{
            // main:'#262254'
            main:'#0073e6'
        },
        secondary:{
            //main:'#543884'
            main:'#fefefe'
        },
        error:{
            main:red.A400
        }
    }
})