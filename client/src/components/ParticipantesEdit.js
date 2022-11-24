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
import {esES} from '@mui/x-data-grid'
import {useEffect, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Grow from "@mui/material/Grow";
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
import Tooltip from "@mui/material/Tooltip";

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

export default function ParticipantesEdit() {
    const {state} = useLocation()
    const {ida,idf, idc} = state;
    const navigate = useNavigate()


    /*Datos*/
    let [personasDisponibles, setPersonasDisponibles] = useState([]);
    let [personasSeleccionadas, setPersonasSeleccionadas] = useState([]);
    let [personasSeleccionadasIniciales, setPersonasSeleccionadasIniciales] = useState([]);
    const [roles, setRoles] = useState([]);
    const [rol, setRol] = useState(null);
    const [pSelDisp, setPSelDisp] = useState(null);
    const [pSelSel, setPSelSel] = useState(null);
    const [popUp, setPopUp] = React.useState(false);
    const [error, setError] = React.useState(false);


    /*Headers*/
    const columnasPDisp = [
        {field: 'id', headerName: 'Codigo', flex: 1, hide: true},
        {field: 'PNombre', headerName: 'Nombre', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PApellido', headerName: 'Apellido', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PNumeroDocumento', headerName: 'Documento', flex: 1, minWidth: 90,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PSexo', headerName: 'Sexo', flex: 1, width: 95,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PMail', headerName: 'Mail', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PNumeroTelefono', headerName: 'Teléfono', minWidth: 110,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )}
    ]
    const columnasPSel = [
        {field: 'id', headerName: 'Codigo', flex: 1, hide: true},
        {field: 'PNombre', headerName: 'Nombre', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PApellido', headerName: 'Apellido', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PNumeroDocumento', headerName: 'Documento', flex: 1, minWidth: 90,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PSexo', headerName: 'Sexo', flex: 1, width: 95,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PMail', headerName: 'Mail', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PNumeroTelefono', headerName: 'Teléfono', minWidth: 110,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PRol', headerName: 'Rol', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )}
    ]


    /*Shows*/
    const [showPersonasDisp, setShowPersonasDisp] = useState(true);


    /*Loaders*/
    async function preCarga(ida) {
        /**
         * Recuperar Roles
         */
        const responseR = await fetch('http://localhost:4000/roles')
        const dataR = await responseR.json()
        var newList0 = []
        for (var i = 0; i < dataR.length; i++) {
            var obj = {label: dataR[i].rol, id: dataR[i].id}
            newList0.push(obj)
        }
        setRoles(newList0)

        /**
         * Recuperar Seleccionados
         * Conseguir listas de personas en esta acreditacion
         * Hacer un get por cada persona y a cada una agregarle el rol como PRol
         */
        const responsePar = await fetch('http://localhost:4000/participa/' + ida)
        const dataPar = await responsePar.json()
        var newList1 = []
        for(var n=0;n<dataPar.length;n++){
            const response = await fetch('http://localhost:4000/persona/' + dataPar[n].idP)
            const data = await response.json()
            if(data.length !== 0){
                var obj = {
                    id: data[0].id,
                    PNombre: data[0].PNombre,
                    PApellido: data[0].PApellido,
                    PNumeroDocumento: data[0].PNumeroDocumento,
                    PSexo: data[0].PSexo,
                    PMail: data[0].PMail,
                    PNumeroTelefono: data[0].PNumeroTelefono,
                    PRol: '0',
                    PRolID: '0'
                }
                if(obj.PTipoDocumento === 1) {
                    obj.TipoDocumento = "DNI";
                }
                else if(obj.PTipoDocumento === 2){
                    obj.TipoDocumento = "LE";
                }
                else if(obj.PTipoDocumento === 3){
                    obj.TipoDocumento = "LC";
                }
                else{
                    obj.TipoDocumento = "CI";
                }
                if (obj.PSexo === 1) {
                    obj.PSexo = "Masculino";
                } else {
                    obj.PSexo = "Femenino";
                }
                for(var j=0;j<newList0.length;j++){
                    if(dataPar[n].idR === newList0[j].id){
                        obj.PRol = newList0[j].label;
                        obj.PRolID = newList0[j].id;
                    }
                }
                newList1.push(obj)
            }
        }
        setPersonasSeleccionadas(newList1)
        setPersonasSeleccionadasIniciales(newList1)


        /**
         * Recuperar Disponibles
         */
        const response = await fetch('http://localhost:4000/personas')
        const data = await response.json()
        var newList2 = []
        for (var i = 0; i < data.length; i++) {
            var obj = {
                id: data[i].id,
                PNombre: data[i].PNombre,
                PApellido: data[i].PApellido,
                PNumeroDocumento: data[i].PNumeroDocumento,
                PSexo: data[i].PSexo,
                PMail: data[i].PMail,
                PNumeroTelefono: data[i].PNumeroTelefono,
            }
            if(obj.PTipoDocumento === 1) {
                obj.TipoDocumento = "DNI";
            }
            else if(obj.PTipoDocumento === 2){
                obj.TipoDocumento = "LE";
            }
            else if(obj.PTipoDocumento === 3){
                obj.TipoDocumento = "LC";
            }
            else{
                obj.TipoDocumento = "CI";
            }
            if (obj.PSexo === 1) {
                obj.PSexo = "Masculino";
            } else {
                obj.PSexo = "Femenino";
            }
            newList2.push(obj)
        }
        /**
         * Limpieza Disponibles
         */
        var newList3 = []
        for(var j=0;j<newList2.length;j++){
            var isPresent = false;
            for(var i=0;i<newList1.length;i++){
                if(newList1[i].id === newList2[j].id){
                    isPresent = true;
                }
            }
            if(!isPresent){
                var obj = {
                    id: newList2[j].id,
                    PNombre: newList2[j].PNombre,
                    PApellido: newList2[j].PApellido,
                    PNumeroDocumento: newList2[j].PNumeroDocumento,
                    PSexo: newList2[j].PSexo,
                    PMail: newList2[j].PMail,
                    PNumeroTelefono: newList2[j].PNumeroTelefono,
                }
                newList3.push(obj);
            }
        }
        setPersonasDisponibles(newList3)
    }
    function loadPersonasSel(v) {
        /*Agregar Seleccionado*/
        var newList = []
        for (var i = 0; i < personasSeleccionadas.length; i++) {
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
        for (var k = 0; k < newList.length; k++) {
            newList2 = newList2.filter(e => e.id !== newList[k].id)
        }
        setPersonasDisponibles(newList2)
    }
    function loadPersonasDisp(v) {
        /*Agregar Seleccionado*/
        var newList = []
        for (var i = 0; i < personasDisponibles.length; i++) {
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
        for (var k = 0; k < newList.length; k++) {
            newList2 = newList2.filter(e => e.id !== newList[k].id)
        }
        setPersonasSeleccionadas(newList2)
    }


    /*Handlers*/
    const handleFinalizarAgregarPersonas = e => {
        setShowPersonasDisp(false);
    }
    const handleRowClickDisp = (e, v) => {
        setPSelDisp(e.row)
    }
    const handleRowClickSel = (e, v) => {
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
    const handleChangeRR = (e, v) => {
        if (v === null) {
            setRol(null)
            //BOTON NO DISPONIBLE
        } else {
            setRol(v)
            //BOTON DISPONIBLE
        }
    }


    function pertenece(id, arr) {
        var ret = false;
        for(var i=0;i<arr.length;i++){
            if(arr[i].id === id){
                ret = true;
            }
        }
        return ret
    }



    const handleActualizar = async () => {
        /**
         * Alta Personas
         *
         * Seguimiento:
         *      Los que esten cargados, put con rol y status true
         *      Los que se agregan, post
         *      Los que se eliminan de la lista, status false
         */
        var selIn = personasSeleccionadasIniciales
        var selFin = personasSeleccionadas

        /**
         * Si estaba en los iniciales y no esta mas en el final, se elimino
         * Si no estaba en los iniciales y esta en los finales, se agrego
         * Si esta en ambos y cambio el rol, se actualizo
         */

        /**
         * Agregar
         */
        //si toca un boton flag hacer cmbio
        for(var j=0;j<selFin.length;j++){
            if(!pertenece(selFin[j].id,selIn)){
                var obj = {
                    idP: selFin[j].id,
                    idA: ida,
                    idR: selFin[j].PRolID,
                    status: true
                }
                const response = await fetch('http://localhost:4000/participaid/' + obj.idP + '/' + ida)
                const data = await response.json()
                if(data.length !== 0){
                    if(data[0].status === false){
                        const res = await fetch('http://localhost:4000/participaact', {
                            method: 'PUT',
                            body: JSON.stringify(obj),
                            headers: {'Content-Type': 'application/json'},
                        })
                        const data = await res.json();
                        /*Recupero ID de la acreditacion para linkear Personas e Instancias*/
                        var idP = data.idP;
                        if(idP === null || idP === undefined){
                            setError(true);
                        }
                    }
                }
                else{
                    const res = await fetch('http://localhost:4000/participa', {
                        method: 'POST',
                        body: JSON.stringify(obj),
                        headers: {'Content-Type': 'application/json'},
                    })
                    const data = await res.json();
                    var idP = data.idP;
                    if(idP === null || idP === undefined){
                        setError(true);
                        break;
                    }
                }
            }
        }

        /**
         * Eliminar
         */
        for(var i=0;i<selIn.length;i++){
            if(!pertenece(selIn[i].id,selFin)){
                var obj = {
                    idP: selIn[i].id,
                    idA: ida,
                    idR: selIn[i].PRolID,
                    status: false
                }
                const res = await fetch('http://localhost:4000/participaact', {
                    method: 'PUT',
                    body: JSON.stringify(obj),
                    headers: {'Content-Type': 'application/json'},
                })
                const data = await res.json();
                /*Recupero ID de la acreditacion para linkear Personas e Instancias*/
                var idP = data.idP;
                if(idP === null || idP === undefined){
                    setError(true);
                }
            }
        }

        /**
         * Actualizar
         */
        for(var i=0; i<selIn.length;i++){
            for(var j=0;j<selFin.length;j++){
                if(selIn[i].id === selFin[j].id){
                    if(selIn[i].PRolID !== selFin[j].PRolID){
                        var obj = {
                            idP: selFin[i].id,
                            idA: ida,
                            idR: selFin[i].PRolID,
                            status: true
                        }
                        //ACTUALIZAR
                        const res = await fetch('http://localhost:4000/participaact', {
                            method: 'PUT',
                            body: JSON.stringify(obj),
                            headers: {'Content-Type': 'application/json'},
                        })
                        const data = await res.json();
                        var idP = data.idP;
                        if(idP === null || idP === undefined){
                            setError(true);
                        }
                    }
                }
            }
        }





        handleClickOpen();
    }


    /*PopUp*/
    function handleClickOpen() {
        setPopUp(true)
    }
    const handleClose = () => {
        setPopUp(false)
    }
    const handleClosePopUp = () => {
        navigate('/participantes/list', {state: {ida: ida, idf: idf,idc: idc}});
    }


    /*Start Loader*/
    useEffect(() => {
        preCarga(ida)
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md" sx={{mb: 4}} style={{backgroundColor: 'lightblue'}}>
                <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}
                       style={{backgroundColor: '#7dcfb6'}}>
                    <Typography variant="h6" gutterBottom align="center">
                        Editar Participantes
                    </Typography>
                    <React.Fragment>
                        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
                            <Container>
                                <>
                                    <Box>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Grow in={showPersonasDisp} unmountOnExit>
                                                    <div style={{height: '100%'}}>
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
                                                        sx={{width: 200, p: 1}}
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
                                                <div style={{height: '100%'}}>
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
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grow in={showPersonasDisp} unmountOnExit>
                                                    <CustomButton
                                                        variant='contained'
                                                        style={{marginRight: '.5rem', marginLeft: '.5rem'}}
                                                        onClick={handleFinalizarAgregarPersonas}
                                                    >
                                                        Terminar de Editar
                                                    </CustomButton>
                                                </Grow>
                                            </Grid>
                                            <Grid item xs={12} sm={6} display="flex" justifyContent="flex-start" >
                                                <Button
                                                    variant='contained'
                                                    style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8ab8ac', color: 'black'}}
                                                    onClick={(e) => {navigate('/participantes/list', {state: {ida: ida, idf: idf,idc: idc}})}}
                                                    startIcon={<ArrowBackIcon />}
                                                >
                                                    Volver
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" >

                                                <CustomButton
                                                    disabled={showPersonasDisp}

                                                    variant='contained'
                                                    //style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: 'green', color: 'white'}}
                                                    onClick={handleActualizar}
                                                >
                                                    Guardar
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
                            No se pudieron realizar todos los cambios
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
                            Se edito correctamente
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