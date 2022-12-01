import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {useState} from "react";
import IconButton from "@mui/material/IconButton";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import * as PropTypes from "prop-types";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import {useNavigate} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const theme = createTheme({
    palette: {
        Switches: {
            main: '#15A97D'
        },
        rmv: {
            main: '#ff0000',
        },
        add: {
            main: '#008000',
        }
    }
});


/*PopUp*/
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}
BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};



export default function FacultadAlta() {
    const navigate = useNavigate()
    const [fac,setFac] = useState({
        FNombre: ""
    });

    const [popUp,setPopUp] = React.useState(false);
    const [error,setError] = React.useState(false);


    const handleChangeNombre = (e) => {
        setFac({
            ...fac, [e.target.name]: e.target.value
        });
    };
    /*PopUp*/
    function handleClickOpen(){
        setPopUp(true)
    }
    const handleClose = () => {
        setPopUp(false)
    }
    const handleClosePopUp = () => {
        navigate('/facultades');
    }


    const handleAlta = async () =>{
        var facAlt = {
            FNombre: fac.FNombre,
        }
        const res = await fetch('http://localhost:4000/facultades', {
            method: 'POST',
            body: JSON.stringify(facAlt),
            headers: {'Content-Type': 'application/json'},
        })
        const data = await res.json();
        /*Recupero ID de la acreditacion para linkear Personas e Instancias*/
        var idA = data.id;
        console.log(data.id)
        if(idA === null || idA === undefined){
            console.log('Error de alta')
            setError(true);
        }
        handleClickOpen()
    }



    return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md" sx={{ mb: 4 }} style={{backgroundColor: 'lightblue'}}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={{backgroundColor: '#7dcfb6'}}>
                    <Typography variant="h6" gutterBottom align="center">
                        Agregar Unidad Académica
                    </Typography>
                    <React.Fragment>
                        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
                            <Container>
                                <>
                                    <Box>
                                        <Grid item xs={12}>
                                            <TextField
                                                value={fac.FNombre}
                                                variant='filled'
                                                id='FNombre'
                                                name='FNombre'
                                                label='Nombre de la Facultad'
                                                fullWidth
                                                onChange={handleChangeNombre}
                                                inputProps={{style: {color: 'black'}}}
                                                InputLabelProps={{style: {color: 'black'}}}
                                            />
                                        </Grid>
                                        <Box>
                                            <Grid container spacing={3} >
                                                <Grid item xs={12}></Grid>
                                                <Grid item xs={12} sm={6} display="flex" justifyContent="flex-start">
                                                    <Button
                                                        variant='contained'
                                                        style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8ab8ac', color: 'black'}}
                                                        onClick={() => {navigate('/facultades')}}
                                                        startIcon={<ArrowBackIcon />}
                                                    >
                                                        Volver
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" >
                                                    <Button
                                                        variant='contained'
                                                        style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: 'green', color: 'white'}}
                                                        onClick={handleAlta}
                                                    >
                                                        Agregar
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                </>
                            </Container>
                        </Box>
                    </React.Fragment>
                </Paper>
            </Container>
            <div>
                {(error) ? (
                    <BootstrapDialog
                        onClose={handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={popUp}
                    >
                        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                            Error
                        </BootstrapDialogTitle>
                        <DialogContent>
                            No se pudo dar de alta
                        </DialogContent>
                        <DialogActions>
                            <Button color="error" autoFocus onClick={handleClosePopUp}>
                                Aceptar
                            </Button>
                        </DialogActions>
                    </BootstrapDialog>
                ) : (
                    <BootstrapDialog
                        onClose={handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={popUp}
                    >
                        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                            Exito
                        </BootstrapDialogTitle>
                        <DialogContent>
                            Se dio de alta la facultad
                        </DialogContent>
                        <DialogActions>
                            <Button color="success" autoFocus onClick={handleClosePopUp}>
                                Aceptar
                            </Button>
                        </DialogActions>
                    </BootstrapDialog>
                )}

            </div>
        </ThemeProvider>
    )
}