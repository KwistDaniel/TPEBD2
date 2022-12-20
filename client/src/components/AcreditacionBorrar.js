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
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import IconButton from "@mui/material/IconButton";
import esLocale from 'date-fns/locale/es'
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



export default function AcreditacionBorrar() {
    const {state} = useLocation()
    const {ida,idf,idc} = state;
    const navigate = useNavigate()





    /*Datos*/
    const [dateFI,setDateFI] = React.useState(dayjs);
    const [dateFF,setDateFF] = React.useState(null);
    const [tipoAc,setTipoAc] = useState(null);
    const [estadoAc,setEstadoAc] = useState(null);
    const [acreditacion, setAcreditacion] = useState({
        numeroExpediente: null,
        convocatoria: "",
        fechaInicio: dateFI.format('DD/MM/YYYY'),
        fechaFin: "",
        obsProceso: "",
        obsFinalizacion: "",
        tipo: "",
        estado: "",
    })
    const tipo = [
        {label: 'Nueva', id: 1},
        {label: 'En Funcionamiento', id: 2}
    ]
    const estado = [
        {label: 'Vigente', id: 1},
        {label: 'Finalizado', id: 2},
        {label: 'Falla', id: 3}
    ]
    const [popUp,setPopUp] = React.useState(false);
    const [error,setError] = React.useState(false);



    /*Loaders*/
    async function loadAcreditacion(idAcr){
        const response = await fetch('http://localhost:4000/acreditaciones/' + idAcr)
        const data = await response.json()
        var obj = {
            id: data[0].id,
            numeroExpediente: data[0].ANumeroExpediente,
            convocatoria: data[0].AConvocatoria,
            fechaInicio: data[0].AFechaInicio,
            fechaFin: data[0].AFechaFin,
            obsProceso: data[0].AObservacionProceso,
            obsFinalizacion: data[0].AObservacionFinalizacion,
            tipo: data[0].ATipo,
            estado: data[0].AEstado,
        }
        if(data[0].ATipo === 1){
            setTipoAc({label: 'Nueva', id: 1})
        }
        else if (data[0].ATipo === 2){
            setTipoAc({label: 'En Funcionamiento', id: 2})
        }
        else{
            setTipoAc(null)
        }
        if(data[0].AEstado === 1){
            setEstadoAc({label: 'Vigente', id: 1})
        }
        else if (data[0].AEstado === 1){
            setEstadoAc({label: 'Finalizado', id: 2});
        }
        else if (data[0].AEstado === 1){
            setEstadoAc({label: 'Falla', id: 3});
        }
        else{
            setEstadoAc(null);
        }
        var fi = (
            data[0].AFechaInicio.substring(8,10).toString() +
            String.fromCharCode(47) +
            data[0].AFechaInicio.substring(5,7).toString() +
            String.fromCharCode(47) +
            data[0].AFechaInicio.substring(0,4).toString()
        )
        var fi2 = (
            data[0].AFechaInicio.substring(0,4).toString() +
            String.fromCharCode(47) +
            data[0].AFechaInicio.substring(5,7).toString() +
            String.fromCharCode(47) +
            data[0].AFechaInicio.substring(8,10).toString()
        )
        obj.fechaInicio = fi;
        setDateFI(dayjs(fi2,"YYYY-MM-DD"))


        if(data[0].AFechaFin !== null){
            var ff = (
                data[0].AFechaInicio.substring(8,10).toString() +
                String.fromCharCode(47) +
                data[0].AFechaInicio.substring(5,7).toString() +
                String.fromCharCode(47) +
                data[0].AFechaInicio.substring(0,4).toString()
            )
            var ff2 = (
                data[0].AFechaInicio.substring(0,4).toString() +
                String.fromCharCode(47) +
                data[0].AFechaInicio.substring(5,7).toString() +
                String.fromCharCode(47) +
                data[0].AFechaInicio.substring(8,10).toString()
            )
            obj.fechaFin = ff;
            setDateFF(dayjs(ff2,"YYYY-MM-DD"))
        }
        else{
            setDateFF(null)
        }
        setAcreditacion(obj)
    }



    const handleBorrar = async () => {
        /**
         * Borrar Acreditacion
         */
        var acrAlt = {
            id: ida,
            ANumeroExpediente: acreditacion.numeroExpediente,
            AConvocatoria: acreditacion.convocatoria,
            AFechaInicio: acreditacion.fechaInicio,
            AFechaFin: acreditacion.fechaFin,
            ATipo: acreditacion.tipo,
            AEstado: acreditacion.estado,
            AObservacionProceso: acreditacion.obsProceso,
            AObservacionFinalizacion: acreditacion.obsFinalizacion,
            status: false
        }

        const res = await fetch('http://localhost:4000/acreditaciones', {
            method: 'PUT',
            body: JSON.stringify(acrAlt),
            headers: {'Content-Type': 'application/json'},
        })
        const data = await res.json();
        /*Recupero ID de la acreditacion para linkear Personas e Instancias*/
        var idA = data.id;
        if(idA === null || idA === undefined){
            setError(true);
            handleClickOpen();
        }
        handleClickOpen();
    }



    /*PopUp*/
    function handleClickOpen(){
        setPopUp(true)
    }
    const handleClose = () => {
        setPopUp(false)
    }
    const handleClosePopUp = () => {
        navigate('/acreditaciones', {state: {idf: idf, idc: idc}});
    }




    /*Start Loader*/
    useEffect(() => {
        loadAcreditacion(ida)
    }, [])

    return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md" sx={{ mb: 4 }} style={{backgroundColor: 'lightblue'}}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={{backgroundColor: '#7dcfb6'}}>
                    <Typography variant="h6" gutterBottom align="center">
                        Borrar Acreditación
                    </Typography>
                    <React.Fragment>
                        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
                            <Container>
                                <>
                                    <Box>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}></Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    disabled
                                                    value={acreditacion.numeroExpediente}
                                                    variant='filled'
                                                    id='numeroExpediente'
                                                    name='numeroExpediente'
                                                    label='Número de Expediente'
                                                    fullWidth
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    disabled
                                                    value={acreditacion.convocatoria}
                                                    variant='filled'
                                                    id='convocatoria'
                                                    name='convocatoria'
                                                    label='Convocatoria'
                                                    multiline
                                                    rows={3}
                                                    fullWidth
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale={esLocale}
                                                    localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                                                >
                                                    <DesktopDatePicker
                                                        disabled
                                                        disableFuture
                                                        variant='filled'
                                                        id='fechaInicio'
                                                        name='fechaInicio'
                                                        label="Fecha de Inicio"
                                                        inputFormat="DD/MM/YYYY"
                                                        value={dateFI}
                                                        sx={{width:300, p: 1, display: 'block'}}
                                                        inputProps={{style: {color: 'black'}}}
                                                        InputLabelProps={{style: {color: 'black'}}}
                                                        renderInput={(params) => <TextField
                                                            {...params}
                                                            sx={{width:200, p: 1}}
                                                        />}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DesktopDatePicker
                                                        disabled
                                                        variant='filled'
                                                        id='fechaFin'
                                                        name='fechaFin'
                                                        label="Fecha de Fin"
                                                        inputFormat="DD/MM/YYYY"
                                                        value={dateFF}
                                                        sx={{width:200, m: 1, display: 'block'}}
                                                        inputProps={{style: {color: 'black'}}}
                                                        InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                        renderInput={(params) => <TextField
                                                            {...params}
                                                            sx={{width:200, p: 1}}/>}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete
                                                    disabled
                                                    disablePortal
                                                    id="tipo"
                                                    options={tipo}
                                                    value={tipoAc}
                                                    sx={{width:200, p: 1}}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            {...params}
                                                            label="Tipo"/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete
                                                    disabled
                                                    disablePortal
                                                    id="estado"
                                                    options={estado}
                                                    value={estadoAc}
                                                    sx={{width:200, p: 1}}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            {...params}
                                                            label="Estado"/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    disabled
                                                    value={acreditacion.obsProceso}
                                                    variant='filled'
                                                    id='obsProceso'
                                                    name='obsProceso'
                                                    label='Observación del Proceso'
                                                    multiline
                                                    rows={3}
                                                    fullWidth
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    disabled
                                                    value={acreditacion.obsFinalizacion}
                                                    variant='filled'
                                                    id='obsFinalizacion'
                                                    name='obsFinalizacion'
                                                    label='Observación de la Finalización'
                                                    multiline
                                                    rows={3}
                                                    fullWidth
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Box>
                                            <Grid container spacing={3} >
                                                <Grid item xs={12}></Grid>
                                                <Grid item xs={12} sm={6} display="flex" justifyContent="flex-start" >
                                                    <Button
                                                        variant='contained'
                                                        style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8aadb8', color: 'black'}}
                                                        onClick={() => {navigate('/acreditaciones', {state: {idf: idf, idc: idc}})}}
                                                        startIcon={<ArrowBackIcon />}
                                                    >
                                                        Volver
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" >
                                                    <Button
                                                        variant='contained'
                                                        style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8aadb8', color: 'black'}}
                                                        onClick={handleBorrar}
                                                    >
                                                        Borrar
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
                            No se pudo borrar la Acreditación
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={handleClosePopUp}>
                                Volver
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
                            Éxito
                        </BootstrapDialogTitle>
                        <DialogContent>
                            Se borró correctamente la Acreditación
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={handleClosePopUp}>
                                Aceptar
                            </Button>
                        </DialogActions>
                    </BootstrapDialog>
                )}

            </div>
        </ThemeProvider>

    );
}