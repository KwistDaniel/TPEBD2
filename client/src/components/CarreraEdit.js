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
import {useLocation} from "react-router";

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



export default function CarreraAlta() {
    const {state} = useLocation()
    const {idf,idc} = state;
    const navigate = useNavigate()
    const [facultades,setFacultades] = useState(null);
    const [carrera,setCarrera] = useState({
        CNombre: "",
        CTipo: "",
        CObservacion: "",
        CDepartamento: "",
    });
    const tipo = [
        {label: 'Grado', id: 'G'},
        {label: 'Posgrado', id: 'P'},
    ]
    const [fac,setFac] = useState({label: '', id: 0});
    const [popUp,setPopUp] = React.useState(false);
    const [error,setError] = React.useState(false);
    const [showCarrera,setShowCarrera] = useState(false);
    const [tipoC, setTipo] = useState(null)
    const handleChangeFF = (e,v) => {
        if( v === null ){
            setFac(null)
            setShowCarrera(false)
        }
        else{
            setFac(v)
            setShowCarrera(true)
        }
    };
    const handleChangeCarrera = (e,v) => {
        setCarrera({...carrera, [e.target.name]: e.target.value});
    };
    const handleChangeTipo = (e,v) => {
        if( v === null ){
            setTipo(null)
            setCarrera({...carrera, 'CTipo': null});
        }
        else{
            setTipo(v)
            setCarrera({...carrera, 'CTipo': v.id});
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
        navigate('/carreras', {state: {idf: idf}});
    }
    async function loadFacultad(idf){
        const response = await fetch('http://localhost:4000/facultad/' + idf)
        const data = await response.json()
        var obj = {label: data[0].FNombre, id: data[0].id}
        setFac(obj)
    }
    async function loadCarrera(idc){
        const response = await fetch('http://localhost:4000/carrera/' + idc)
        const data = await response.json()
        var obj = {
            id: data[0].id,
            CNombre: data[0].CNombre,
            CTipo: data[0].CTipo,
            CTipoN: data[0].CTipo,
            CObservacion: data[0].CObservacion,
            CDepartamento: data[0].CDepartamento,
        }
        if(obj.CTipo === "G") {
            setTipo({label: "Grado", id: 'G'})
        }
        else if (obj.CTipo === "P"){
            setTipo({label: "Posgrado", id: 'P'})
        }
        setCarrera(obj)
    }

    const handleEdit = async () =>{
        var obj = {
            id: idc,
            CNombre: carrera.CNombre,
            CTipo: tipoC.id,
            CObservacion: carrera.CObservacion,
            CDepartamento: carrera.CDepartamento,
            idF: idf,
            status: true
        }
        const res = await fetch('http://localhost:4000/carreras', {
            method: 'PUT',
            body: JSON.stringify(obj),
            headers: {'Content-Type': 'application/json'},
        })
        const data = await res.json();
        /*Recupero ID de la acreditacion para linkear Personas e Instancias*/
        var idC = data.id;
        console.log(data.id)
        if(idC === null || idC === undefined){
            console.log('Error de alta')
            setError(true);
        }
        handleClickOpen();
    }



    useEffect(() => {
        loadFacultad(idf)
        loadCarrera(idc)
    }, [idf])

    return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md" sx={{ mb: 4 }} style={{backgroundColor: 'lightblue'}}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={{backgroundColor: '#7dcfb6'}}>
                    <Typography variant="h6" gutterBottom align="center">
                        Modificar Carrera
                    </Typography>
                    <React.Fragment>
                        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
                            <Container>
                                <>
                                    <Box>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={fac.label}
                                                    variant='filled'
                                                    id='facultad'
                                                    label='Facultad'
                                                    fullWidth
                                                    inputProps={{readOnly: true, style: {color: 'black'}}}
                                                    InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={carrera.CNombre}
                                                    variant='filled'
                                                    id='CNombre'
                                                    name='CNombre'
                                                    label='Nombre de la Carrera'
                                                    fullWidth
                                                    onChange={handleChangeCarrera}
                                                    inputProps={{readOnly: true, style: {color: 'black'}}}
                                                    InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    required
                                                    disablePortal
                                                    id="CTipo"
                                                    options={tipo}
                                                    value={tipoC}
                                                    sx={{width:200, p: 1}}
                                                    onChange={handleChangeTipo}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            required
                                                            {...params}
                                                            label="Tipo"/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={carrera.CDepartamento}
                                                    variant='filled'
                                                    id='CDepartamento'
                                                    name='CDepartamento'
                                                    label='Departamento'
                                                    fullWidth
                                                    onChange={handleChangeCarrera}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={carrera.CObservacion}
                                                    variant='filled'
                                                    id='CObservacion'
                                                    name='CObservacion'
                                                    label='Observación'
                                                    multiline
                                                    rows={3}
                                                    fullWidth
                                                    onChange={handleChangeCarrera}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} display="flex" justifyContent="flex-start" >
                                                <Button
                                                    variant='contained'
                                                    style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8aadb8', color: 'black'}}
                                                    onClick={() => {navigate('/carreras', {state: {idf: idf}})}}
                                                    startIcon={<ArrowBackIcon />}
                                                >
                                                    Volver
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" >
                                                <Button
                                                    variant='contained'
                                                    style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: 'green', color: 'white'}}
                                                    onClick={handleEdit}
                                                >
                                                    Guardar
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
                            No se pudo guardar los cambios
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
                            Se guardaron los datos
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