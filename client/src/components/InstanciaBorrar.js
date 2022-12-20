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


export default function InstanciaBorrar() {
    const {state} = useLocation()
    const {ida,idf,idc,idi} = state;
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
        IObservacion: "",
        IFechaInicio: "",
        IFechaPresentacion: "",
        IFechaLimite: "",
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
    async function loadInstancia(idi){
        const response = await fetch('http://localhost:4000/instancia/' + idi)
        const data = await response.json()
        var obj = {
            IObservacion: data[0].IObservacion,
            IFechaInicio: data[0].IFechaInicio,
            IFechaPresentacion: data[0].IFechaPresentacion,
            IFechaLimite: data[0].IFechaLimite,
            idTI: data[0].idTI,
            idTipo: ''
        }

        const response2 = await fetch('http://localhost:4000/tipoInstancia')
        const data2 = await response2.json()

        for(var j=0;j<data2.length;j++){
            if(obj.idTI === data2[j].id){
                obj.idTipo = data2[j].TITipo;
            }
        }

        if(data[0].IFechaInicio !== null){
            var fi = (
                data[0].IFechaInicio.substring(8,10).toString() +
                String.fromCharCode(47) +
                data[0].IFechaInicio.substring(5,7).toString() +
                String.fromCharCode(47) +
                data[0].IFechaInicio.substring(0,4).toString()
            )
            var fi2 = (
                data[0].IFechaInicio.substring(0,4).toString() +
                String.fromCharCode(47) +
                data[0].IFechaInicio.substring(5,7).toString() +
                String.fromCharCode(47) +
                data[0].IFechaInicio.substring(8,10).toString()
            )
            obj.IFechaInicio = fi;
            setDateFIIns(dayjs(fi2,"YYYY-MM-DD"))
        }
        else{
            setDateFIIns(null)
        }
        if(data[0].IFechaPresentacion !== null){
            var fp = (
                data[0].IFechaPresentacion.substring(8,10).toString() +
                String.fromCharCode(47) +
                data[0].IFechaPresentacion.substring(5,7).toString() +
                String.fromCharCode(47) +
                data[0].IFechaPresentacion.substring(0,4).toString()
            )
            var fp2 = (
                data[0].IFechaPresentacion.substring(0,4).toString() +
                String.fromCharCode(47) +
                data[0].IFechaPresentacion.substring(5,7).toString() +
                String.fromCharCode(47) +
                data[0].IFechaPresentacion.substring(8,10).toString()
            )
            obj.IFechaPresentacion = fp;
            setDateFPIns(dayjs(fp2,"YYYY-MM-DD"))
        }
        else{
            setDateFPIns(null)
        }
        if(data[0].IFechaLimite !== null){
            var fl = (
                data[0].IFechaLimite.substring(8,10).toString() +
                String.fromCharCode(47) +
                data[0].IFechaLimite.substring(5,7).toString() +
                String.fromCharCode(47) +
                data[0].IFechaLimite.substring(0,4).toString()
            )
            var fl2 = (
                data[0].IFechaLimite.substring(0,4).toString() +
                String.fromCharCode(47) +
                data[0].IFechaLimite.substring(5,7).toString() +
                String.fromCharCode(47) +
                data[0].IFechaLimite.substring(8,10).toString()
            )
            obj.IFechaLimite = fl;
            setDateFLIns(dayjs(fl2,"YYYY-MM-DD"))
        }
        else{
            setDateFLIns(null)
        }
        setInstancia(obj)
    }


    /*Handlers*/
    const handleChangeIns = e =>{
        setInstancia({
            ...instancia, [e.target.name]: e.target.value
        });
    }
    const handleChangeFIIns = e => {
        if(e === null){
            setDateFIIns(null)
            setInstancia({...instancia, 'IFechaInicio': ""});
        }
        else{
            setDateFIIns(e);
            setInstancia({...instancia, 'IFechaInicio': (e).format('DD/MM/YYYY')});
        }
    };
    const handleChangeFPIns = e => {
        if (e === null) {
            setDateFPIns(null)
            setInstancia({...instancia, 'IFechaPresentacion': ""});
        } else {
            setDateFPIns(e);
            setInstancia({...instancia, 'IFechaPresentacion': (e).format('DD/MM/YYYY')});
        }
    };
    const handleChangeFLIns = e => {
        if (e === null) {
            setDateFLIns(null)
            setInstancia({...instancia, 'IFechaLimite': ""});
        } else {
            setDateFLIns(e);
            setInstancia({...instancia, 'IFechaLimite': (e).format('DD/MM/YYYY')});
        }
    };
    const handleEdit = async () =>{
        /**
         * Alta Instasncia
         */
        var obj = {
            id: idi,
            IObservacion: instancia.IObservacion,
            IFechaInicio: instancia.IFechaInicio,
            IFechaPresentacion: instancia.IFechaPresentacion,
            IFechaLimite: instancia.IFechaLimite,
            idA: ida,
            idTI: instancia.idTI,
            status: false
        }

        const res = await fetch('http://localhost:4000/instancia', {
            method: 'PUT',
            body: JSON.stringify(obj),
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
        loadInstancia(idi)
    }, [])

    return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md" sx={{ mb: 4 }} style={{backgroundColor: 'lightblue'}}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={{backgroundColor: '#7dcfb6'}}>
                    <Typography variant="h6" gutterBottom align="center">
                        Borrar Instancia
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
                                                <TextField
                                                    value={instancia.idTipo}
                                                    variant='filled'
                                                    id='tipoDeInstancia'
                                                    label='Tipo de Instancia'
                                                    fullWidth
                                                    inputProps={{readOnly: true, style: {color: 'black'}}}
                                                    InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    disabled
                                                    value={instancia.IObservacion}
                                                    variant='filled'
                                                    id='IObservacion'
                                                    name='IObservacion'
                                                    label='Observación'
                                                    multiline
                                                    rows={3}
                                                    fullWidth
                                                    onChange={handleChangeIns}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale={esLocale}
                                                    localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                                                >
                                                    <DesktopDatePicker
                                                        disabled
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
                                                        disabled
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
                                                        disabled
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
                            No se pudo borrar la Instancia
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
                            Se borró correctamente la Instancia
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