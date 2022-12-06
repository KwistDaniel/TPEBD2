import {Button, Container} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import {Box} from "@mui/system";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {esES} from '@mui/x-data-grid'
import {useLocation} from "react-router";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";


export default function InstanciaList(){
    const {state} = useLocation()
    const {ida,idf,idc} = state;

    const [instancias,setInstancias] = useState([]);
    const [fac,setFac] = useState("");
    const [car,setCar] = useState("");
    const [ac,setAc] = useState("")

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
    async function loadInstancias(idA){
        const response = await fetch('http://localhost:4000/instancias/' + idA)
        const data = await response.json()
        const response2 = await fetch('http://localhost:4000/tipoInstancia')
        const data2 = await response2.json()

        for(var i=0;i<data.length;i++){
            for(var j=0;j<data2.length;j++){
                if(data[i].idTI === data2[j].id){
                    data[i].idTI = data2[j].TITipo;
                }
                var fi = (
                    data[i].IFechaInicio.substring(0,4).toString() +
                    String.fromCharCode(47) +
                    data[i].IFechaInicio.substring(5,7).toString() +
                    String.fromCharCode(47) +
                    data[i].IFechaInicio.substring(8,10).toString()
                )
                data[i].IFechaInicio = fi;

                if(data[i].IFechaPresentacion !== null){
                    var fp = (
                        data[i].IFechaPresentacion.substring(0,4).toString() +
                        String.fromCharCode(47) +
                        data[i].IFechaPresentacion.substring(5,7).toString() +
                        String.fromCharCode(47) +
                        data[i].IFechaPresentacion.substring(8,10).toString()
                    )
                    data[i].IFechaPresentacion = fp;
                }
                if(data[i].IFechaLimite !== null){
                    var fl = (
                        data[i].IFechaLimite.substring(0,4).toString() +
                        String.fromCharCode(47) +
                        data[i].IFechaLimite.substring(5,7).toString() +
                        String.fromCharCode(47) +
                        data[i].IFechaLimite.substring(8,10).toString()
                    )
                    data[i].IFechaLimite = fl;
                }
            }
        }
        setInstancias(data)
    }


    const navigate = useNavigate()

    const columnas = [
        {field: 'id', headerName: 'Codigo', flex: 1, hide: true},
        {field: 'idTI', headerName: 'Tipo', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'IObservacion', headerName: 'Observación', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'IFechaInicio', headerName: 'Fecha de Inicio', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'IFechaPresentacion', headerName: 'Fecha de Presentación', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'IFechaLimite', headerName: 'Fecha Limite', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'document', headerName: 'Documentacion', flex: 1, renderCell: (cellValues) => {return (
                <Button
                    color="inherit"
                >Documentacion</Button>)}},
        {field: 'edit', headerName: 'Editar', flex:1, maxWidth: 70,
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/instancias/edit' , {state: {ida: ida, idf: idf, idc: idc, idi: cellValues.id}})}}
                    color="inherit"
                ><HistoryEduIcon /></Button>)}},
        {field: 'delete', headerName: 'Borrar', flex:1, maxWidth: 55,
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/instancias/delete' , {state: {ida: ida, idf: idf, idc: idc, idi: cellValues.id}})}}
                    color="inherit"
                ><DeleteIcon /></Button>)}},
    ]


    useEffect(() => {
        loadFacultad(idf)
        loadCarrera(idc)
        loadAcreditacion(ida)
        loadInstancias(ida)
    }, [idf,idc,ida])


    return(
        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
            <Container>
                <>
                    <h1> Instancias </h1>
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
                        <div style={{height: '100%' }}>
                            <DataGrid
                                style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                autoHeight
                                rows={instancias}
                                columns={columnas}
                                pageSize={10}
                                rowsPerPageOptions={[5]}
                                initialState={{
                                    sorting:{
                                        sortModel: [{field: 'id', sort: 'desc'}],
                                    },
                                }}
                                minHeight={750}
                            />
                        </div>
                    </Box>
                </>
                <Toolbar>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-start" >
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
                            <Button
                            variant='contained'
                            style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8ab8ac', color: 'black'}}
                            onClick={() => {navigate('/instancias/new' , {state: {ida: ida, idf: idf, idc: idc}})}}
                            startIcon={<AddCircleOutlineOutlinedIcon />}
                            >
                                Agregar
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </Container>
        </Box>
    )
}