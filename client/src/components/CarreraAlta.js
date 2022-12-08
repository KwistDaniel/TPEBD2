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
import {OutlinedInput, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

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


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


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
    const {idf} = state;
    const navigate = useNavigate()
    const [universidades,setUniversidades] = useState({label: '', id: 0});
    const [carrera,setCarrera] = useState({
        CNombre: "",
        CTipo: "",
        CObservacion: "",
        CDepartamento: "",
        CModalidad: "",
        idF: ""
    });
    const tipo = [
        {label: 'Grado', id: 'G'},
        {label: 'Posgrado', id: 'P'},
    ]
    const modalidad = [
        {label: 'Presencial', id: 'P'},
        {label: 'A distancia', id: 'D'},
    ]
    const [fac,setFac] = useState({label: '', id: 0});
    const [universidadesSel,setUniversidadesSel] = useState({label: '', id: 0});
    const [popUp,setPopUp] = React.useState(false);
    const [error,setError] = React.useState(false);
    const [tipoC, setTipo] = useState(null)
    const [modalidadC, setModalidad] = useState(null)
    const handleChangeFF = (e,v) => {
        if( v === null ){
            setFac(null)
        }
        else{
            setFac(v)
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
    const handleChangeModalidad = (e,v) => {
        if( v === null ){
            setModalidad(null)
            setCarrera({...carrera, 'CModalidad': null});
        }
        else{
            setModalidad(v)
            setCarrera({...carrera, 'CModalidad': v.id});
        }
    };
    const handleChangeUniversidad = (e,v) => {

        setUniversidadesSel({v});
        console.log(universidadesSel)
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
    async function loadFacultades(idf){
        const response = await fetch('http://localhost:4000/facultad/' + idf)
        const data = await response.json()
        var obj = {label: data[0].FNombre, id: data[0].id}
        setFac(obj)
    }
    async function loadUniversidades(){
        const response = await fetch('http://localhost:4000/universidades')
        const data = await response.json()
        var newList = [];
        for(var i=0;i<data.length;i++){
            var obj = {label: data[i].UNombre, id: data[i].id}
            newList.push(obj)
        }
        setUniversidades(newList)
    }

    const handleAlta = async () =>{
        console.log(carrera)
        var carAlt = {
            CNombre: carrera.CNombre,
            CTipo: tipoC.id,
            CObservacion: carrera.CObservacion,
            CDepartamento: carrera.CDepartamento,
            CModalidad: modalidadC.id,
            idF: fac.id,
        }
        const res = await fetch('http://localhost:4000/carreras', {
            method: 'POST',
            body: JSON.stringify(carAlt),
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
        loadFacultades(idf)
        loadUniversidades()
    }, [])

    return(
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md" sx={{ mb: 4 }} style={{backgroundColor: 'lightblue'}}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={{backgroundColor: '#7dcfb6'}}>
                    <Typography variant="h6" gutterBottom align="center">
                        Agregar Carrera
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
                                                    inputProps={{style: {color: 'black'}}}
                                                    InputLabelProps={{style: {color: 'black'}}}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
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
                                            <Grid item xs={12} sm={6}>
                                                <Autocomplete
                                                    required
                                                    disablePortal
                                                    id="CModalidad"
                                                    options={modalidad}
                                                    value={modalidadC}
                                                    sx={{width:200, p: 1}}
                                                    onChange={handleChangeModalidad}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            {...params}
                                                            label="Modalidad"/>}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    multiple
                                                    limitTags={2}
                                                    id="autocomplete-multiple-universidades"
                                                    options={Object.values(universidades)}
                                                    getOptionLabel={(option) => option.label}
                                                    //defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
                                                    onChange={handleChangeUniversidad}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Universidades" placeholder="Buscar" />
                                                    )}
                                                    fullWidth
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
                            Se dio de alta la carrera
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