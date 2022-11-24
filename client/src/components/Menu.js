import Container from "@mui/material/Container";
import {Typography} from "@mui/material";
import {Box} from "@mui/system";
import React from "react";
import Grid from "@mui/material/Grid";

export default function Menu(){
    return(
        <Grid sx={{flexGrow: 1, flex: 0, padding: 0}}>
            <Grid container spacing={3} >
                <Grid item xs={12}></Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={12} display="flex" justifyContent="center" >
                    <img src={require('../resources/escudo-unsl-436px.png')} />
                </Grid>
            </Grid>
            <Grid container spacing={3} >
                <Grid item xs={12}></Grid>
                <Grid item xs={12}>
                    <Typography variant='h4' display='flex' justifyContent='center' >
                        <div style={{textAlign: 'center'}}>
                            Universidad Nacional de San Luis
                        </div>
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}