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
import {useEffect, useState} from "react";
import IconButton from "@mui/material/IconButton";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import * as PropTypes from "prop-types";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router";
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



export default function PersonaBorrar() {
    const {state} = useLocation()
    const {idp} = state;

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

    async function loadPersona(idp){
        const response = await fetch('http://localhost:4000/persona/' + idp)
        const data = await response.json()
        var obj = {
            PNombre: data[0].PNombre,
            PApellido: data[0].PApellido,
            PTipoDocumento: data[0].PTipoDocumento,
            PNumeroDocumento: data[0].PNumeroDocumento,
            PSexo: data[0].PSexo,
            PMail: data[0].PMail,
            PNumeroTelefono: data[0].PNumeroTelefono
        }
        if(obj.PTipoDocumento === 1){
            setPTipoDNI({label: 'DNI', id: 1})
        }
        else if(obj.PTipoDocumento === 2){
            setPTipoDNI({label: 'LE', id: 2})
        }
        else if (obj.PTipoDocumento === 3){
            setPTipoDNI({label: 'LC', id: 3})
        }
        else {
            setPTipoDNI({label: 'CI', id: 4})
        }
        if(obj.PSexo === 1){
            setPSexo({label: 'Masculino', id: 1})
        }
        else{
            setPSexo({label: 'Femenino', id: 2})
        }
        setPersona(obj)
    }

    const handleEdit = async () =>{
        var perAlt = {
            id: idp,
            PNombre: persona.PNombre,
            PApellido: persona.PApellido,
            PTipoDocumento: pTipoDNI.id,
            PNumeroDocumento: persona.PNumeroDocumento,
            PSexo: pSexo.id,
            PMail: persona.PMail,
            PNumeroTelefono: persona.PNumeroTelefono,
            status: false
        }
        const res = await fetch('http://localhost:4000/personas', {
            method: 'PUT',
            body: JSON.stringify(perAlt),
            headers: {'Content-Type': 'application/json'},
        })
        const data = await res.json();
        /*Recupero ID de la acreditacion para linkear Personas e Instancias*/
        var idP = data.id;
        if(idP === null || idP === undefined){
            console.log('Error de alta')
            setError(true);
        }
        handleClickOpen();
    }

    useEffect(() => {
        loadPersona(idp)
    }, [])

    return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md" sx={{ mb: 4 }} style={{backgroundColor: 'lightblue'}}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={{backgroundColor: '#7dcfb6'}}>
                    <Typography variant="h6" gutterBottom align="center">
                        Borrar Persona
                    </Typography>
                    <React.Fragment>
                        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
                            <Container>
                                <>
                                    <Box>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    disabled
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
                                                    disabled
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
                                                    disabled
                                                    disablePortal
                                                    id="PTipoDNI"
                                                    options={tipoDNI}
                                                    value={pTipoDNI}
                                                    sx={{width:200, p: 1}}
                                                    onChange={handleChangeTipoDNI}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            {...params}
                                                            label="Tipo de Documento"/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete
                                                    disabled
                                                    disablePortal
                                                    id="PSexo"
                                                    options={sexo}
                                                    value={pSexo}
                                                    sx={{width:200, p: 1}}
                                                    onChange={handleChangeSexo}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            {...params}
                                                            label="Sexo"/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    disabled
                                                    value={persona.PNumeroDocumento}
                                                    variant='filled'
                                                    id='PNumeroDocumento'
                                                    name='PNumeroDocumento'
                                                    label='Numero de Documento'
                                                    fullWidth
                                                    onChange={handleChangePersona}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    disabled
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
                                                    disabled
                                                    value={persona.PNumeroTelefono}
                                                    variant='filled'
                                                    id='PNumeroTelefono'
                                                    name='PNumeroTelefono'
                                                    label='Numero de Telefono'
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
                                                    style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8aadb8', color: 'black'}}
                                                    onClick={handleEdit}
                                                >
                                                    Borrar
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
                            No se pudo borrar
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
                            Se borraron los datos
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