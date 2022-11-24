import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {DesktopDatePicker, esES, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import esLocale from "date-fns/locale/es";
import * as React from "react";
import {createTheme, styled, ThemeProvider} from "@mui/material/styles";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import * as PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import {useLocation} from "react-router";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ButtonUnstyled, {buttonUnstyledClasses} from "@mui/base/ButtonUnstyled";
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

const blue = {
    500: '#8a96b8',
    600: '#8AADB8',
    700: '#344145',
};

const green = {
    500: '#329932',
    600: '#198C19',
    700: '#008000',
};

const CustomButton = styled(ButtonUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  font-weight: bold;
  font-size: 0.875rem;
  background-color: ${green[500]};
  padding: 12px 24px;
  border-radius: 12px;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: ${green[600]};
  }

  &.${buttonUnstyledClasses.active} {
    background-color: ${green[700]};
  }

  &.${buttonUnstyledClasses.focusVisible} {
    box-shadow: 0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5);
    outline: none;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;


export default function InstanciaAlta() {
    const {state} = useLocation()
    const {ida,idf,idc} = state;
    const navigate = useNavigate()



    /*Datos*/

    const [tI,setTI] = useState(null);
    const [fac,setFac] = useState("");
    const [car,setCar] = useState("");
    const [ac,setAc] = useState("")

    const [tiposInstancia,setTiposInstancia] = useState([])


    const [dateFIIns,setDateFIIns] = React.useState(null);
    const [dateFPIns,setDateFPIns] = React.useState(null);
    const [dateFLIns,setDateFLIns] = React.useState(null);
    const [instancia, setInstancia] = useState({
        observacion: "",
        fechaInicio: "",
        fechaPresentacion: "",
        fechaLimite: "",
        tipo: 1,
        estado: "",
        documentos: false,
    })
    const [popUp,setPopUp] = React.useState(false);
    const [error,setError] = React.useState(false);



    /*Loaders*/
    async function loadFacultad(idf){
        const response = await fetch('http://localhost:4000/facultad/' + idf)
        const data = await response.json()
        var obj = {label: data[0].FNombre, id: data[0].id}
        setFac(obj)
    }
    async function loadCarrera(idc){
        const response = await fetch('http://localhost:4000/carrera/' + idc)
        const data = await response.json()
        var obj = {label: data[0].CNombre, id: data[0].id}
        setCar(obj)
    }
    async function loadAcreditacion(ida){
        const response = await fetch('http://localhost:4000/acreditaciones/' + ida)
        const data = await response.json()
        var obj = {label: data[0].ANumeroExpediente, id: data[0].id}
        setAc(obj)
    }
    async function loadTiposInstancia(){
        const response = await fetch('http://localhost:4000/tipoInstancia')
        const data = await response.json()
        var newList =[]
        for( var i=0; i<data.length;i++){
            var obj = {label: data[i].TITipo, id: data[i].id}
            newList.push(obj)
        }
        setTiposInstancia(newList)
    }


    /*Handlers*/
    const handleChangeTI = (e,v) => {
        if( v === null ){
            setTI(null)
            setInstancia({...instancia, 'idTI': null});
        }
        else{
            setTI(v)
            setInstancia({...instancia, 'idTI': v.id});
        }
    };

    const handleChangeIns = e =>{
        setInstancia({
            ...instancia, [e.target.name]: e.target.value
        });
    }
    const handleChangeFIIns = e => {
        if(e === null){
            setDateFIIns(null)
            setInstancia({...instancia, 'fechaInicio': ""});
        }
        else{
            setDateFIIns(e);
            setInstancia({...instancia, 'fechaInicio': (e).format('DD/MM/YYYY')});
        }
    };
    const handleChangeFPIns = e => {
        if (e === null) {
            setDateFPIns(null)
            setInstancia({...instancia, 'fechaPresentacion': ""});
        } else {
            setDateFPIns(e);
            setInstancia({...instancia, 'fechaPresentacion': (e).format('DD/MM/YYYY')});
        }
    };
    const handleChangeFLIns = e => {
        if (e === null) {
            setDateFLIns(null)
            setInstancia({...instancia, 'fechaLimite': ""});
        } else {
            setDateFLIns(e);
            setInstancia({...instancia, 'fechaLimite': (e).format('DD/MM/YYYY')});
        }
    };
    const handleAlta = async () =>{
        /**
         * Alta Instasncia
         */
        var acrAlt = {
            IObservacion: instancia.observacion,
            IFechaInicio: instancia.fechaInicio,
            IFechaPresentacion: instancia.fechaPresentacion,
            IFechaLimite: instancia.fechaLimite,
            idA: ida,
            idTI: tI.id,
        }
        const res = await fetch('http://localhost:4000/instancias', {
            method: 'POST',
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
        navigate('/instancias/list', {state: {ida: ida, idf: idf, idc: idc}});
    }




    /*Start Loader*/
    useEffect(() => {
        loadFacultad(idf)
        loadCarrera(idc)
        loadAcreditacion(ida)
        loadTiposInstancia()
    }, [])

    return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md" sx={{ mb: 4 }} style={{backgroundColor: 'lightblue'}}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={{backgroundColor: '#7dcfb6'}}>
                    <Typography variant="h6" gutterBottom align="center">
                        Agregar Instancia
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
                                                    value={car.label}
                                                    variant='filled'
                                                    id='carrera'
                                                    label='Carrera'
                                                    fullWidth
                                                    inputProps={{readOnly: true, style: {color: 'black'}}}
                                                    InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={ac.label}
                                                    variant='filled'
                                                    id='numeroExpediente'
                                                    label='Numero de Expediente'
                                                    fullWidth
                                                    inputProps={{readOnly: true, style: {color: 'black'}}}
                                                    InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}></Grid>
                                        </Grid>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    disablePortal
                                                    id="idRol"
                                                    name="idRol"
                                                    options={tiposInstancia}
                                                    value={tI}
                                                    sx={{width: 200, p: 1}}
                                                    onChange={handleChangeTI}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            required
                                                            {...params}
                                                            label="Tipo de Instancia"/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={instancia.observacion}
                                                    variant='filled'
                                                    id='observacion'
                                                    name='observacion'
                                                    label='Observación'
                                                    multiline
                                                    rows={3}
                                                    fullWidth
                                                    onChange={handleChangeIns}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale={esLocale}
                                                    localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                                                >
                                                    <DesktopDatePicker
                                                        disableFuture
                                                        variant='filled'
                                                        id='fechaInicioIns'
                                                        name='fechaInicioIns'
                                                        label="Fecha de Inicio"
                                                        inputFormat="DD/MM/YYYY"
                                                        value={dateFIIns}
                                                        sx={{width:300, p: 1, display: 'block'}}
                                                        onChange={handleChangeFIIns}
                                                        inputProps={{style: {color: 'black'}}}
                                                        InputLabelProps={{style: {color: 'black'}}}
                                                        renderInput={(params) => <TextField
                                                            required
                                                            {...params}
                                                            sx={{width:200, p: 1}}
                                                        />}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DesktopDatePicker
                                                        variant='filled'
                                                        id='fechaPresentacionIns'
                                                        name='fechaPresentacionIns'
                                                        label="Fecha de Presentación"
                                                        inputFormat="DD/MM/YYYY"
                                                        value={dateFPIns}
                                                        sx={{width:200, m: 1, display: 'block'}}
                                                        onChange={handleChangeFPIns}
                                                        inputProps={{style: {color: 'black'}}}
                                                        InputLabelProps={{style: {color: 'black'}}}
                                                        renderInput={(params) => <TextField
                                                            {...params}
                                                            sx={{width:200, p: 1}}/>}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>

                                                    <DesktopDatePicker
                                                        variant='filled'
                                                        id='fechaLimiteIns'
                                                        name='fechaLimiteIns'
                                                        label="Fecha Límite"
                                                        inputFormat="DD/MM/YYYY"
                                                        value={dateFLIns}
                                                        sx={{width:200, m: 1, display: 'block'}}
                                                        onChange={handleChangeFLIns}
                                                        inputProps={{style: {color: 'black'}}}
                                                        InputLabelProps={{style: {color: 'black'}}}
                                                        renderInput={(params) => <TextField
                                                            {...params}
                                                            sx={{width:200, p: 1}}/>}
                                                    />

                                                </LocalizationProvider>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box>
                                        <Grid container spacing={3} >
                                            <Grid item xs={12}></Grid>
                                            <Grid item xs={12} sm={6} display="flex" justifyContent="flex-start" >
                                                <Button
                                                    variant='contained'
                                                    style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8aadb8', color: 'black'}}
                                                    onClick={() => {navigate('/instancias/list', {state: {ida: ida, idf: idf, idc: idc}})}}
                                                    startIcon={<ArrowBackIcon />}
                                                >
                                                    Volver
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" >
                                                <CustomButton
                                                    disabled={
                                                        (!instancia.fechaInicio) || (tI === null)
                                                    }

                                                    variant='contained'
                                                    //style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: 'green', color: 'white'}}
                                                    onClick={handleAlta}
                                                >
                                                    Agregar
                                                </CustomButton>
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
                            No se pudo agregar la Instancia
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={handleClose}>
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
                            Se agregó correctamente la Instancia
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