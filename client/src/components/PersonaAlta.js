import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {LocalizationProvider, MobileDatePicker, DesktopDatePicker, esES} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Grow from "@mui/material/Grow";
import esLocale from 'date-fns/locale/es'
import Switch from '@mui/material/Switch'
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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



export default function PersonaAlta() {
    const navigate = useNavigate()
    const [pTipoDNI,setPTipoDNI] = useState(null);
    const [pSexo,setPSexo] = useState(null);

    const [persona,setPersona] = useState({
        PNombre: "",
        PApellido: "",
        PTipoDocumento: "",
        PNumeroDocumento: "",
        PSexo: "",
        PMail: "",
        PNumeroTelefono: "",
    });
    const tipoDNI = [
        {label: 'DNI', id: 1},
        {label: 'LE', id: 2},
        {label: 'LC', id: 3},
        {label: 'CI', id: 4},
    ]
    const sexo = [
        {label: 'Masculino', id: 1},
        {label: 'Femenino', id: 2},
    ]


    const [popUp,setPopUp] = React.useState(false);
    const [error,setError] = React.useState(false);


    const handleChangePersona = (e,v) => {
        setPersona({...persona, [e.target.name]: e.target.value});
    };

    const handleChangeTipoDNI = (e,v) => {
        if( v === null ){
            setPTipoDNI(null)
        }
        else{
            setPTipoDNI(v)
        }
    };

    const handleChangeSexo = (e,v) => {
        if( v === null ){
            setPSexo(null)
        }
        else{
            setPSexo(v)
        }
    };

    /*PopUp*/
    function handleClickOpen(){
        setPopUp(true)
    }
    const handleClose = () => {
        setPopUp(false)
    }
    const handleClosePopUp = () => {
        navigate('/personas');
    }


    const handleAlta = async () =>{
        console.log(persona)
        var perAlt = {
            PNombre: persona.PNombre,
            PApellido: persona.PApellido,
            PTipoDocumento: pTipoDNI.id,
            PNumeroDocumento: persona.PNumeroDocumento,
            PSexo: pSexo.id,
            PMail: persona.PMail,
            PNumeroTelefono: persona.PNumeroTelefono,
        }
        console.log(perAlt)
        const res = await fetch('http://localhost:4000/personas', {
            method: 'POST',
            body: JSON.stringify(perAlt),
            headers: {'Content-Type': 'application/json'},
        })
        const data = await res.json();
        /*Recupero ID de la acreditacion para linkear Personas e Instancias*/
        var idP = data.id;
        console.log(data.id)
        if(idP === null || idP === undefined){
            console.log('Error de alta')
            setError(true);
        }
        handleClickOpen();
    }

    return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md" sx={{ mb: 4 }} style={{backgroundColor: 'lightblue'}}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={{backgroundColor: '#7dcfb6'}}>
                    <Typography variant="h6" gutterBottom align="center">
                        Agregar Persona
                    </Typography>
                    <React.Fragment>
                        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
                            <Container>
                                <>
                                    <Box>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    value={persona.PNombre}
                                                    variant='filled'
                                                    id='PNombre'
                                                    name='PNombre'
                                                    label='Nombre'
                                                    fullWidth
                                                    onChange={handleChangePersona}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    value={persona.PApellido}
                                                    variant='filled'
                                                    id='PApellido'
                                                    name='PApellido'
                                                    label='Apellido'
                                                    fullWidth
                                                    onChange={handleChangePersona}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete
                                                    required
                                                    disablePortal
                                                    id="PTipoDNI"
                                                    options={tipoDNI}
                                                    value={pTipoDNI}
                                                    sx={{width:200, p: 1}}
                                                    onChange={handleChangeTipoDNI}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            required
                                                            {...params}
                                                            label="Tipo de Documento"/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete
                                                    required
                                                    disablePortal
                                                    id="PSexo"
                                                    options={sexo}
                                                    value={pSexo}
                                                    sx={{width:200, p: 1}}
                                                    onChange={handleChangeSexo}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            required
                                                            {...params}
                                                            label="Sexo"/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={persona.PNumeroDocumento}
                                                    variant='filled'
                                                    id='PNumeroDocumento'
                                                    name='PNumeroDocumento'
                                                    label='Número de Documento'
                                                    fullWidth
                                                    onChange={handleChangePersona}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={persona.PMail}
                                                    variant='filled'
                                                    id='PMail'
                                                    name='PMail'
                                                    label='Mail'
                                                    fullWidth
                                                    onChange={handleChangePersona}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={persona.PNumeroTelefono}
                                                    variant='filled'
                                                    id='PNumeroTelefono'
                                                    name='PNumeroTelefono'
                                                    label='Número de Teléfono'
                                                    fullWidth
                                                    onChange={handleChangePersona}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} display="flex" justifyContent="flex-start" >
                                                <Button
                                                    variant='contained'
                                                    style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8aadb8', color: 'black'}}
                                                    onClick={() => {navigate('/personas')}}
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
                            Se dio de alta la persona
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