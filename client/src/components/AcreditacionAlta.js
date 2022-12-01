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
import {LocalizationProvider, DesktopDatePicker} from "@mui/x-date-pickers";
import {esES} from '@mui/x-data-grid'
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
import {useLocation} from "react-router";
import ButtonUnstyled, { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
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





export default function AcreditacionAlta() {
    const {state} = useLocation()
    const {idf,idc} = state;
    const navigate = useNavigate()




    /*Datos*/
    const [fac,setFac] = useState("");
    const [car,setCar] = useState("");
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
        {label: 'En Funcionamiento', id: 2},
    ]
    const estado = [
        {label: 'Vigente', id: 1},
        {label: 'Finalizado', id: 2},
        {label: 'Falla', id: 3},
    ]
    let [personasDisponibles,setPersonasDisponibles] = useState([]);
    const [roles,setRoles] = useState([]);
    let [personasSeleccionadas,setPersonasSeleccionadas] = useState([]);
    const [rol,setRol] = useState(null);
    const [pSelDisp,setPSelDisp] = useState(null);
    const [pSelSel,setPSelSel] = useState(null);
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



    /*Headers*/
    const columnasPDisp = [
        {field: 'id', headerName: 'Codigo', flex: 1, hide: true},
        {field: 'PNombre', headerName: 'Nombre', flex: 1},
        {field: 'PApellido', headerName: 'Apellido', flex: 1},
        {field: 'PNumeroDocumento', headerName: 'Documento', flex: 1, minWidth: 90},
        {field: 'PSexo', headerName: 'Sexo', flex: 1, width: 95},
        {field: 'PMail', headerName: 'Mail', flex: 1},
        {field: 'PNumeroTelefono', headerName: 'Teléfono', minWidth: 110}
    ]
    const columnasPSel = [
        {field: 'id', headerName: 'Codigo', flex: 1, hide: true},
        {field: 'PNombre', headerName: 'Nombre', flex: 1},
        {field: 'PApellido', headerName: 'Apellido', flex: 1},
        {field: 'PNumeroDocumento', headerName: 'Documento', flex: 1, minWidth: 90},
        {field: 'PSexo', headerName: 'Sexo', flex: 1, width: 95},
        {field: 'PMail', headerName: 'Mail', flex: 1},
        {field: 'PNumeroTelefono', headerName: 'Teléfono', minWidth: 110},
        {field: 'PRol', headerName: 'Rol', flex: 1}
    ]



    /*Shows*/
    const [showPersonasDisp,setShowPersonasDisp] = useState(false);
    const [showPersonasSel,setShowPersonasSel] = useState(false);
    const [showFormalizacion,setShowFormalizacion] = useState(false);



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
    async function loadPersonas(){
        const response = await fetch('http://localhost:4000/personas')
        const data = await response.json()
        for( var i=0;i<data.length;i++){
            if(data[i].PTipoDocumento === 1) {
                data[i].TipoDocumento = "DNI";
            }
            else if(data[i].PTipoDocumento === 2){
                data[i].TipoDocumento = "LE";
            }
            else if(data[i].PTipoDocumento === 3){
                data[i].TipoDocumento = "LC";
            }
            else{
                data[i].TipoDocumento = "CI";
            }
            if(data[i].PSexo === 1){
                data[i].PSexo = "Masculino";
            }
            else{
                data[i].PSexo = "Femenino";
            }
        }
        setPersonasDisponibles(data)
    }

    async function loadRoles(){
        const response = await fetch('http://localhost:4000/roles')
        const data = await response.json()
        var newList =[]
        for( var i=0; i<data.length;i++){
            var obj = {label: data[i].rol, id: data[i].id}
            newList.push(obj)
        }
        setRoles(newList)
    }
    function loadPersonasSel(v){
        /*Agregar Seleccionado*/
        var newList = []
        for( var i=0; i<personasSeleccionadas.length;i++){
            var obj = {
                id: personasSeleccionadas[i].id,
                PNombre: personasSeleccionadas[i].PNombre,
                PApellido: personasSeleccionadas[i].PApellido,
                PNumeroDocumento: personasSeleccionadas[i].PNumeroDocumento,
                PSexo: personasSeleccionadas[i].PSexo,
                PMail: personasSeleccionadas[i].PMail,
                PNumeroTelefono: personasSeleccionadas[i].PNumeroTelefono,
                PRol: personasSeleccionadas[i].PRol,
                PRolID: personasSeleccionadas[i].PRolID
            }
            newList.push(obj)
        }
        newList.push(v)
        setPersonasSeleccionadas(newList)

        /*Vaciar los Disponibles*/
        var newList2 = personasDisponibles;
        for(var k=0;k<newList.length;k++) {
            newList2 = newList2.filter(e => e.id !== newList[k].id)
        }
        setPersonasDisponibles(newList2)
    }
    function loadPersonasDisp(v){
        /*Agregar Seleccionado*/
        var newList = []
        for( var i=0; i<personasDisponibles.length;i++){
            var obj = {
                id: personasDisponibles[i].id,
                PNombre: personasDisponibles[i].PNombre,
                PApellido: personasDisponibles[i].PApellido,
                PNumeroDocumento: personasDisponibles[i].PNumeroDocumento,
                PSexo: personasDisponibles[i].PSexo,
                PMail: personasDisponibles[i].PMail,
                PNumeroTelefono: personasDisponibles[i].PNumeroTelefono,
            }
            newList.push(obj)
        }
        newList.push(v)
        setPersonasDisponibles(newList)

        /*Vaciar los Disponibles*/
        var newList2 = personasSeleccionadas;
        for(var k=0;k<newList.length;k++) {
            newList2 = newList2.filter(e => e.id !== newList[k].id)
        }
        setPersonasSeleccionadas(newList2)
    }


    /*Handlers*/
    const handleChangeFechaInicio = (newValue) => {
        if(newValue === null){
            setDateFI(null)
            setAcreditacion({...acreditacion, 'fechaInicio': ""})
        }
        else{
            setDateFI(newValue);
            setAcreditacion({...acreditacion, 'fechaInicio': (newValue).format('YYYY-MM-DD')});
        }
    };
    const handleChangeFechaFin = (newValue) => {
        if(newValue === null){
            setDateFF(null)
            setAcreditacion({...acreditacion, 'fechaFin': ""})
        }
        else{
            setDateFF(newValue);
            setAcreditacion({...acreditacion, 'fechaFin': (newValue).format('YYYY-MM-DD')});
        }
    };
    const handleChangeAc = e =>{
        setAcreditacion({...acreditacion, [e.target.name]: e.target.value});
    }
    const handleChangeAcTi = (e,v) => {
        if( v === null ){
            setTipoAc(null)
            setAcreditacion({...acreditacion, 'tipo': null});
        }
        else{
            setTipoAc(v)
            setAcreditacion({...acreditacion, 'tipo': v.id});
        }
    };
    const handleChangeAcEs = (e,v) => {
        if( v === null ){
            setEstadoAc()
            setAcreditacion({...acreditacion, 'estado': null});
        }
        else{
            setEstadoAc(v)
            setAcreditacion({...acreditacion, 'estado': v.id});
        }
    };
    const handleAgregarPersonas = e => {
        setShowPersonasDisp(e.target.checked);
        setShowPersonasSel(e.target.checked);
    }
    const handleFinalizarAgregarPersonas = e => {
        setShowPersonasDisp(false);
    }
    const handleRowClickDisp = (e,v) => {
        setPSelDisp(e.row)
    }
    const handleRowClickSel = (e,v) => {
        setPSelSel(e.row)
    }
    const handleClickFlechaAdd = (e) => {
        var obj = {
            id: pSelDisp.id,
            PNombre: pSelDisp.PNombre,
            PApellido: pSelDisp.PApellido,
            PNumeroDocumento: pSelDisp.PNumeroDocumento,
            PSexo: pSelDisp.PSexo,
            PMail: pSelDisp.PMail,
            PNumeroTelefono: pSelDisp.PNumeroTelefono,
            PRol: rol.label,
            PRolID: rol.id
        }
        loadPersonasSel(obj)
        setRol(null);

    }
    const handleClickFlechaRmv = (e) => {
        var obj = {
            id: pSelSel.id,
            PNombre: pSelSel.PNombre,
            PApellido: pSelSel.PApellido,
            PNumeroDocumento: pSelSel.PNumeroDocumento,
            PSexo: pSelSel.PSexo,
            PMail: pSelSel.PMail,
            PNumeroTelefono: pSelSel.PNumeroTelefono,
        }
        loadPersonasDisp(obj)
        setRol(null);
    }
    const handleChangeRR = (e,v) => {
        if( v === null ){
            setRol(null)
            //BOTON NO DISPONIBLE
        }
        else{
            setRol(v)
            //BOTON DISPONIBLE
        }
    }
    const handleAgregarFormalizacion = e => {
        setShowFormalizacion(e.target.checked)
    }
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
            setInstancia({...instancia, 'fechaInicio': (e).format('YYYY-MM-DD')});
        }
    };
    const handleChangeFPIns = e => {
        if (e === null) {
            setDateFPIns(null)
            setInstancia({...instancia, 'fechaPresentacion': ""});
        } else {
            setDateFPIns(e);
            setInstancia({...instancia, 'fechaPresentacion': (e).format('YYYY-MM-DD')});
        }
    };
    const handleChangeFLIns = e => {
        if (e === null) {
            setDateFLIns(null)
            setInstancia({...instancia, 'fechaLimite': ""});
        } else {
            setDateFLIns(e);
            setInstancia({...instancia, 'fechaLimite': (e).format('YYYY-MM-DD')});
        }
    };
    const handleAlta = async () =>{
        /**
         * Alta Acreditacion
         */
        var ff;
        if(acreditacion.fechaFin === ""){
            ff = null
        }
        else{
            ff = acreditacion.fechaFin
        }
        var acrAlt = {
            ANumeroExpediente: acreditacion.numeroExpediente,
            AConvocatoria: acreditacion.convocatoria,
            AFechaInicio: acreditacion.fechaInicio,
            AFechaFin: ff,
            ATipo: acreditacion.tipo,
            AEstado: acreditacion.estado,
            AObservacionProceso: acreditacion.obsProceso,
            AObservacionFinalizacion: acreditacion.obsFinalizacion,
            idC: car.id
        }
        const res = await fetch('http://localhost:4000/acreditaciones', {
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


        if(!error){
            /**
             * Alta Personas
             */
            if(showPersonasSel === true){
                for(var i=0;i<personasSeleccionadas.length;i++){
                    var perAlt = {
                        idP: personasSeleccionadas[i].id,
                        idA: idA,
                        idR: personasSeleccionadas[i].PRolID
                    }
                    const res = await fetch('http://localhost:4000/participa', {
                        method: 'POST',
                        body: JSON.stringify(perAlt),
                        headers: {'Content-Type': 'application/json'},
                    })
                    const data = await res.json();
                    var idPaux = data.idP;
                    if(idPaux === null || idPaux === undefined){
                        setError(true);
                        handleClickOpen();
                        break;
                    }
                }
            }
        }

        if(!error){
            /**
             * Alta Formalizacion
             */
            var fp;
            if(instancia.fechaPresentacion === ""){
                fp = null
            }
            else{
                fp = instancia.fechaPresentacion
            }
            var fl;
            if(instancia.fechaLimite === ""){
                fl = null
            }
            else{
                fl = instancia.fechaLimite
            }
            if(showFormalizacion === true){
                var forAlt = {
                    IObservacion: instancia.observacion,
                    IFechaInicio: instancia.fechaInicio,
                    IFechaPresentacion: fp,
                    IFechaLimite: fl,
                    idA: idA,
                    idTI: 1,
                }
                const res = await fetch('http://localhost:4000/instancias', {
                    method: 'POST',
                    body: JSON.stringify(forAlt),
                    headers: {'Content-Type': 'application/json'},
                })
                const data = await res.json();
                var idFaux = data.id;
                if(idFaux === null || idFaux === undefined){
                    setError(true);
                    handleClickOpen();
                }
            }
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
        loadFacultad(idf)
        loadCarrera(idc)
        loadPersonas()
        loadRoles()
    }, [idf,idc])

    return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md" sx={{ mb: 4 }} style={{backgroundColor: 'lightblue'}}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={{backgroundColor: '#7dcfb6'}}>
                    <Typography variant="h6" gutterBottom align="center">
                        Agregar Acreditación
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
                                                    value={acreditacion.numeroExpediente}
                                                    variant='filled'
                                                    id='numeroExpediente'
                                                    name='numeroExpediente'
                                                    label='Número de Expediente'
                                                    fullWidth
                                                    onChange={handleChangeAc}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    value={acreditacion.convocatoria}
                                                    variant='filled'
                                                    id='convocatoria'
                                                    name='convocatoria'
                                                    label='Convocatoria'
                                                    fullWidth
                                                    onChange={handleChangeAc}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{shrink: true, style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale={esLocale}
                                                >
                                                    <DesktopDatePicker
                                                        disableFuture
                                                        variant='filled'
                                                        id='fechaInicio'
                                                        name='fechaInicio'
                                                        label="Fecha de Inicio"
                                                        inputFormat="YYYY-MM-DD"
                                                        value={dateFI}
                                                        sx={{width:300, p: 1, display: 'block'}}
                                                        onChange={handleChangeFechaInicio}
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

                                            <Grid item xs={12} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DesktopDatePicker
                                                        variant='filled'
                                                        id='fechaFin'
                                                        name='fechaFin'
                                                        label="Fecha de Fin"
                                                        inputFormat="YYYY-MM-DD"
                                                        value={dateFF}
                                                        sx={{width:200, m: 1, display: 'block'}}
                                                        onChange={handleChangeFechaFin}
                                                        inputProps={{style: {color: 'black'}}}
                                                        InputLabelProps={{style: {color: 'black'}}}
                                                        renderInput={(params) => <TextField
                                                            {...params}
                                                            sx={{width:200, p: 1}}/>}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete
                                                    disablePortal
                                                    id="tipo"
                                                    options={tipo}
                                                    value={tipoAc}
                                                    sx={{width:200, p: 1}}
                                                    onChange={handleChangeAcTi}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            required
                                                            {...params}
                                                            label="Tipo"/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete
                                                    disablePortal
                                                    id="estado"
                                                    options={estado}
                                                    value={estadoAc}
                                                    sx={{width:200, p: 1}}
                                                    onChange={handleChangeAcEs}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            required
                                                            {...params}
                                                            label="Estado"/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={acreditacion.obsProceso}
                                                    variant='filled'
                                                    id='obsProceso'
                                                    name='obsProceso'
                                                    label='Observación del Proceso'
                                                    multiline
                                                    rows={3}
                                                    fullWidth
                                                    onChange={handleChangeAc}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    value={acreditacion.obsFinalizacion}
                                                    variant='filled'
                                                    id='obsFinalizacion'
                                                    name='obsFinalizacion'
                                                    label='Observación de la Finalización'
                                                    multiline
                                                    rows={3}
                                                    fullWidth
                                                    onChange={handleChangeAc}
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{style: {color: 'black'}}}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Box>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}></Grid>
                                                <Grid item xs={12}>
                                                    <div>
                                                        <FormGroup>
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        color="Switches"
                                                                        onChange={handleAgregarPersonas} />}
                                                                label="Agregar Personas"
                                                            />
                                                        </FormGroup>
                                                    </div>
                                                </Grid>
                                            </Grid>


                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Grow in={showPersonasDisp} unmountOnExit>
                                                        <div style={{height: '100%' }}>
                                                            <DataGrid
                                                                disableMultipleSelection={true}
                                                                style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                                                autoHeight
                                                                rows={personasDisponibles}
                                                                columns={columnasPDisp}
                                                                pageSize={5}
                                                                rowsPerPageOptions={[5]}
                                                                minHeight={750}
                                                                onRowClick={handleRowClickDisp}
                                                            />
                                                        </div>
                                                    </Grow>
                                                </Grid>
                                                <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
                                                    <Grow in={showPersonasDisp} unmountOnExit>
                                                        <IconButton
                                                            disabled={!rol}
                                                            color="add"
                                                            variant="outlined"
                                                            onClick={handleClickFlechaAdd}
                                                        >
                                                            <ExpandMoreIcon/>
                                                        </IconButton>
                                                    </Grow>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Grow in={showPersonasDisp} unmountOnExit>
                                                        <Autocomplete
                                                            disablePortal
                                                            id="idRol"
                                                            name="idRol"
                                                            options={roles}
                                                            value={rol}
                                                            sx={{width:200, p: 1}}
                                                            onChange={handleChangeRR}
                                                            renderInput={(params) =>
                                                                <TextField
                                                                    required
                                                                    {...params}
                                                                    label="Rol"/>}
                                                        />
                                                    </Grow>
                                                </Grid>
                                                <Grid item xs={12} sm={4} display="flex" justifyContent="flex-start">
                                                    <Grow in={showPersonasDisp} unmountOnExit>
                                                        <IconButton
                                                            disabled={personasSeleccionadas.length === 0}
                                                            color="rmv"
                                                            variant="outlined"
                                                            onClick={handleClickFlechaRmv}
                                                        >
                                                            <ExpandLessIcon/>
                                                        </IconButton>
                                                    </Grow>
                                                </Grid>
                                            </Grid>

                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Grow in={showPersonasSel} unmountOnExit>
                                                        <div style={{height: '100%' }}>
                                                            <DataGrid
                                                                disableMultipleSelection={true}
                                                                style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                                                autoHeight
                                                                rows={personasSeleccionadas}
                                                                columns={columnasPSel}
                                                                pageSize={5}
                                                                rowsPerPageOptions={[5]}
                                                                minHeight={750}
                                                                onRowClick={handleRowClickSel}
                                                            />
                                                        </div>
                                                    </Grow>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grow in={showPersonasDisp} unmountOnExit>
                                                        <Button
                                                            disabled={personasSeleccionadas.length === 0}
                                                            variant='contained'
                                                            style={{marginRight: '.5rem',marginLeft: '.5rem'}}
                                                            onClick={handleFinalizarAgregarPersonas}
                                                        >
                                                            Terminar de Agregar
                                                        </Button>
                                                    </Grow>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <div>
                                                        <FormGroup>
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        color="Switches"
                                                                        onChange={handleAgregarFormalizacion} />}
                                                                label="Agregar Formalización"
                                                            />
                                                        </FormGroup>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grow in={showFormalizacion} unmountOnExit>
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
                                                    </Grow>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}
                                                        adapterLocale={esLocale}
                                                    >
                                                        <Grow in={showFormalizacion} unmountOnExit>
                                                            <DesktopDatePicker
                                                                disableFuture
                                                                variant='filled'
                                                                id='fechaInicioIns'
                                                                name='fechaInicioIns'
                                                                label="Fecha de Inicio"
                                                                inputFormat="YYYY-MM-DD"
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
                                                        </Grow>
                                                    </LocalizationProvider>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <Grow in={showFormalizacion} unmountOnExit>
                                                            <DesktopDatePicker
                                                                variant='filled'
                                                                id='fechaPresentacionIns'
                                                                name='fechaPresentacionIns'
                                                                label="Fecha de Presentación"
                                                                inputFormat="YYYY-MM-DD"
                                                                value={dateFPIns}
                                                                sx={{width:200, m: 1, display: 'block'}}
                                                                onChange={handleChangeFPIns}
                                                                inputProps={{style: {color: 'black'}}}
                                                                InputLabelProps={{style: {color: 'black'}}}
                                                                renderInput={(params) => <TextField
                                                                    {...params}
                                                                    sx={{width:200, p: 1}}/>}
                                                            />
                                                        </Grow>
                                                    </LocalizationProvider>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <Grow in={showFormalizacion} unmountOnExit>
                                                            <DesktopDatePicker
                                                                variant='filled'
                                                                id='fechaLimiteIns'
                                                                name='fechaLimiteIns'
                                                                label="Fecha Límite"
                                                                inputFormat="YYYY-MM-DD"
                                                                value={dateFLIns}
                                                                sx={{width:200, m: 1, display: 'block'}}
                                                                onChange={handleChangeFLIns}
                                                                inputProps={{style: {color: 'black'}}}
                                                                InputLabelProps={{style: {color: 'black'}}}
                                                                renderInput={(params) => <TextField
                                                                    {...params}
                                                                    sx={{width:200, p: 1}}/>}
                                                            />
                                                        </Grow>
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box>
                                            <Grid container spacing={3} >
                                                <Grid item xs={12} sm={6} display="flex" justifyContent="flex-start">
                                                    <Button
                                                        variant='contained'
                                                        style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8ab8ac', color: 'black'}}
                                                        onClick={() => {navigate('/acreditaciones' , {state: {idf: idf, idc: idc}})}}
                                                        startIcon={<ArrowBackIcon />}
                                                    >
                                                        Volver
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" >
                                                    <CustomButton
                                                        disabled={
                                                            (!acreditacion.convocatoria || !acreditacion.fechaInicio || !acreditacion.estado || !acreditacion.tipo)
                                                            ||
                                                            ((showPersonasSel && (personasSeleccionadas.length === 0)) || (showPersonasDisp))
                                                            ||
                                                            (showFormalizacion && !instancia.fechaInicio)
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
                            No se pudo agregar la Acreditación
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
                            Se agregó correctamente la Acreditación
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