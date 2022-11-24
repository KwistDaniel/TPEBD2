import {Button, Container} from "@mui/material";
import PropTypes from 'prop-types';
import {Box} from "@mui/system";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {esES, GridPrintExportMenuItem, GridToolbarExport} from '@mui/x-data-grid'
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grow from '@mui/material/Grow'
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExportContainer,
    GridCsvExportMenuItem,
    useGridApiContext,
    gridFilteredSortedRowIdsSelector,
    gridVisibleColumnFieldsSelector,
} from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';

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

const getJson = (apiRef) => {
    const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef)
    const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef)

    const data = filteredSortedRowIds.map((id) =>{
        const row = {}
        visibleColumnsField.forEach((field) => {
            row[field] = apiRef.current.getCellParams(id,field).value;
        })
        return row;
    })
    return JSON.stringify(data,null,2)
}

const exportBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
    });
};

const JsonExportMenuItem = (props) => {
    const apiRef = useGridApiContext();

    const { hideMenu } = props;

    return (
        <MenuItem
            onClick={() => {
                const jsonString = getJson(apiRef);
                const blob = new Blob([jsonString], {
                    type: 'text/json',
                });

                exportBlob(blob, 'DataGrid_demo.json');

                // Hide the export menu after the export
                hideMenu?.();
            }}
        >
            Export JSON
        </MenuItem>
    );
};

JsonExportMenuItem.propTypes = {
    hideMenu: PropTypes.func,
};

const csvOptions = { delimiter: ';' };

const CustomExportButton = (props) => (
    <GridToolbarExportContainer style={{color: 'black'}} {...props}>
        <GridPrintExportMenuItem />
        <GridCsvExportMenuItem options={csvOptions} />
        <JsonExportMenuItem />
    </GridToolbarExportContainer>
);

const CustomExport = (props) => (
    <GridToolbarContainer {...props} >
        <CustomExportButton />
    </GridToolbarContainer>
);


export default function Informes(){
    const navigate = useNavigate()

    /*Data*/
    const [facultades,setFacultades] = useState([]);
    const [facI3,setFacI3] = useState({label: "", id: 0});

    const [showI1,setShowI1] = useState(false);
    const [showI2,setShowI2] = useState(false);
    const [showI31,setShowI31] = useState(false);
    const [showI32,setShowI32] = useState(false);
    const [acreditacionI1, setAcreditacionI1] = useState([])
    const [acreditacionI2, setAcreditacionI2] = useState([])
    const [acreditacionI3, setAcreditacionI3] = useState([])

    /*Loaders*/
    async function preCarga(){
        const responseF = await fetch('http://localhost:4000/facultades')
        const dataF = await responseF.json()
        var newListF =[]
        for( var i=0; i<dataF.length;i++){
            var obj = {label: dataF[i].FNombre, id: dataF[i].id}
            newListF.push(obj)
        }
        setFacultades(newListF)


        const responseA = await fetch('http://localhost:4000/acreditaciones')
        const dataA = await responseA.json()
        var newListA = []
        for(var i=0;i<dataA.length;i++){
            var obj = {
                id: dataA[i].id,
                ANumeroExpediente: dataA[i].ANumeroExpediente,
                AConvocatoria: dataA[i].AConvocatoria,
                AFechaInicio: dataA[i].AFechaInicio,
                AFechaFin: dataA[i].AFechaFin,
                AEstado: dataA[i].AEstado,
                ATipo: dataA[i].ATipo,
                AObservacionProceso: dataA[i].AObservacionProceso,
                AObservacionFinalizacion: dataA[i].AObservacionFinalizacion,
                idC: dataA[i].idC,
            }
            if(obj.AEstado === 1) {
                obj.Estado = "Vigente";
            }
            else if(obj.AEstado === 2){
                obj.Estado = "Finalizado";
            }
            else{
                obj.Estado = "Falla";
            }
            if(obj.ATipo === 1){
                obj.Tipo = "Carrera nueva";
            }
            else{
                obj.Tipo = "Carrera en funcionamiento";
            }
            newListA.push(obj)
        }

        var ac1 = newListA.filter(ac => ac.AEstado === 1)
        var ac2 = newListA.filter(ac => ac.AFechaFin === '')

        setAcreditacionI1(ac1)
        setAcreditacionI2(ac2)


    }
    const loadAcreditacionesI3 = async (idf) => {
        const responseC = await fetch('http://localhost:4000/carreras/' + idf)
        const dataC = await responseC.json()
        var newListC = []
        for( var i=0; i<dataC.length;i++){
            newListC.push(dataC[i].id)
        }
        var newListA = []
        for(var j=0;j<newListC.length;j++){
            const responseA = await fetch('http://localhost:4000/acreditaciones/carrera/' + newListC[j])
            const dataA = await responseA.json()
            for(var i=0;i<dataA.length;i++){
                var obj = {
                    id: dataA[i].id,
                    ANumeroExpediente: dataA[i].ANumeroExpediente,
                    AConvocatoria: dataA[i].AConvocatoria,
                    AFechaInicio: dataA[i].AFechaInicio,
                    AFechaFin: dataA[i].AFechaFin,
                    AEstado: dataA[i].AEstado,
                    ATipo: dataA[i].ATipo,
                    AObservacionProceso: dataA[i].AObservacionProceso,
                    AObservacionFinalizacion: dataA[i].AObservacionFinalizacion,
                    idC: dataA[i].idC,

                }
                if(obj.AEstado === 1) {
                    obj.Estado = "Vigente";
                }
                else if(obj.AEstado === 2){
                    obj.Estado = "Finalizado";
                }
                else{
                    obj.Estado = "Falla";
                }
                if(obj.ATipo === 1){
                    obj.Tipo = "Carrera nueva";
                }
                else{
                    obj.Tipo = "Carrera en funcionamiento";
                }
                newListA.push(obj)
            }

        }
        setAcreditacionI3(newListA)
    }

    /*Handlers*/
    const handleFCI1 = e => {
        setShowI1(e.target.checked);
    }
    const handleFCI2 = e => {
        setShowI2(e.target.checked);
    }
    const handleFCI3 = e => {
        setShowI31(e.target.checked);
        if(e.target.checked === false){
            setShowI32(false)
        }
        else{
            if(facI3.id !== 0){
                setShowI32(true)
            }
        }
    }
    const handleChangeFFI3 = (e,v) => {
        if( v === null ){
            setFacI3({label: "", id: 0})
            setAcreditacionI3([])
            setShowI32(false)
        }
        else{
            setFacI3(v)
            setShowI32(true)
            loadAcreditacionesI3(v.id)
        }
    };


    const columnasI1 = [
        {field: 'id', headerName: 'Codigo', flex: 1, hide: true},
        {field: 'ANumeroExpediente', headerName: 'Nº de Expediente', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AConvocatoria', headerName: 'Convocatoria', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaInicio', headerName: 'Fecha de Inicio', maxWidth: 115, flex: 1,},
        {field: 'AFechaFin', headerName: 'Fecha de Fin', maxWidth: 105 ,flex: 1},
        {field: 'AEstado', headerName: 'AEstado', flex: 1, hide: true},
        {field: 'ATipo', headerName: 'ATipo', flex: 1, hide: true, },
        {field: 'Estado', headerName: 'Estado', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'Tipo', headerName: 'Tipo', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )
        },
        {field: 'AObservacionProceso', headerName: 'Obs. del Proceso', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AObservacionFinalizacion', headerName: 'Obs. de la Finalización', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'Instancias', flex: 1, renderCell: (cellValues) => {return (<Button variant='text'
                                                                                    style={{color: 'black'}}
                                                                                    onClick={() => {navigate('/instancias/list' , {state: {ida: cellValues.id, idf: facI3.id,idc: cellValues.idC}})}}
            >Ver</Button>)}, hide: true},
        {field: 'Participantes', flex: 1, renderCell: (cellValues) => {return (<Button
                variant='text'
                style={{color: 'black'}}
                onClick={(e) => {navigate('/participantes/list', {state: {ida: cellValues.id, idf: facI3.id,idc: cellValues.idC}})}}
            >Ver</Button>)}, hide: true},
        {field: 'idC', headerName: 'idC', flex: 1, hide: true}
    ]
    const columnasI2 = [
        {field: 'id', headerName: 'Codigo', flex: 1, hide: true},
        {field: 'ANumeroExpediente', headerName: 'Nº de Expediente', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AConvocatoria', headerName: 'Convocatoria', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaInicio', headerName: 'Fecha de Inicio', maxWidth: 115, flex: 1,},
        {field: 'AFechaFin', headerName: 'Fecha de Fin', maxWidth: 105 ,flex: 1},
        {field: 'AEstado', headerName: 'AEstado', flex: 1, hide: true},
        {field: 'ATipo', headerName: 'ATipo', flex: 1, hide: true, },
        {field: 'Estado', headerName: 'Estado', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'Tipo', headerName: 'Tipo', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )
        },
        {field: 'AObservacionProceso', headerName: 'Obs. del Proceso', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AObservacionFinalizacion', headerName: 'Obs. de la Finalización', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'Instancias', flex: 1, renderCell: (cellValues) => {return (<Button variant='text'
                                                                                    style={{color: 'black'}}
                                                                                    onClick={() => {navigate('/instancias/list' , {state: {ida: cellValues.id, idf: facI3.id,idc: cellValues.idC}})}}
            >Ver</Button>)}, hide: true},
        {field: 'Participantes', flex: 1, renderCell: (cellValues) => {return (<Button
                variant='text'
                style={{color: 'black'}}
                onClick={(e) => {navigate('/participantes/list', {state: {ida: cellValues.id, idf: facI3.id,idc: cellValues.idC}})}}
            >Ver</Button>)}, hide: true},
        {field: 'idC', headerName: 'idC', flex: 1, hide: true}
    ]
    const columnasI3 = [
        {field: 'id', headerName: 'Codigo', flex: 1, hide: true},
        {field: 'ANumeroExpediente', headerName: 'Nº de Expediente', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AConvocatoria', headerName: 'Convocatoria', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaInicio', headerName: 'Fecha de Inicio', maxWidth: 115, flex: 1,},
        {field: 'AFechaFin', headerName: 'Fecha de Fin', maxWidth: 105 ,flex: 1},
        {field: 'AEstado', headerName: 'AEstado', flex: 1, hide: true},
        {field: 'ATipo', headerName: 'ATipo', flex: 1, hide: true, },
        {field: 'Estado', headerName: 'Estado', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'Tipo', headerName: 'Tipo', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )
        },
        {field: 'AObservacionProceso', headerName: 'Obs. del Proceso', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AObservacionFinalizacion', headerName: 'Obs. de la Finalización', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'Instancias', flex: 1, renderCell: (cellValues) => {return (<Button variant='text'
                                                                                    style={{color: 'black'}}
                                                                                    onClick={() => {navigate('/instancias/list' , {state: {ida: cellValues.id, idf: facI3.id,idc: cellValues.idC}})}}
            >Ver</Button>)}, hide: true},
        {field: 'Participantes', flex: 1, renderCell: (cellValues) => {return (<Button
                variant='text'
                style={{color: 'black'}}
                onClick={(e) => {navigate('/participantes/list', {state: {ida: cellValues.id, idf: facI3.id,idc: cellValues.idC}})}}
            >Ver</Button>)}, hide: true},
        {field: 'idC', headerName: 'idC', flex: 1, hide: true}
    ]

    useEffect(() => {
        preCarga()
    }, [])


    return(
        <ThemeProvider theme={theme}>
            <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
                <Container>
                    <>
                        <Box>
                            <h1> Informes</h1>
                            <Box>
                                <h2> Acreditaciones Vigentes</h2>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <div>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            color="Switches"
                                                            onChange={handleFCI1} />}
                                                    label="Mostrar"
                                                />
                                            </FormGroup>
                                        </div>
                                        <Grow in={showI1} unmountOnExit>
                                            <div style={{height: '100%' }}>
                                                <DataGrid
                                                    style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                                    autoHeight
                                                    rows={acreditacionI1}
                                                    columns={columnasI1}
                                                    pageSize={10}
                                                    rowsPerPageOptions={[10]}
                                                    components={{Toolbar: CustomExport}}
                                                    initialState={{
                                                        sorting:{
                                                            sortModel: [{field: 'id', sort: 'asc'}],
                                                        },
                                                    }}
                                                    minHeight={750}
                                                    rowMouseEnter
                                                />
                                            </div>
                                        </Grow>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box>
                                <h2> Acreditaciones Finalizadas</h2>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <div>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            color="Switches"
                                                            onChange={handleFCI2} />}
                                                    label="Mostrar"
                                                />
                                            </FormGroup>
                                        </div>
                                        <Grow in={showI2} unmountOnExit>
                                            <div style={{height: '100%' }}>
                                                <DataGrid
                                                    style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                                    autoHeight
                                                    rows={acreditacionI2}
                                                    columns={columnasI2}
                                                    pageSize={10}
                                                    rowsPerPageOptions={[10]}
                                                    components={{Toolbar: CustomExport}}
                                                    initialState={{
                                                        sorting:{
                                                            sortModel: [{field: 'id', sort: 'asc'}],
                                                        },
                                                    }}
                                                    minHeight={750}
                                                    rowMouseEnter
                                                />
                                            </div>
                                        </Grow>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box>
                                <h2> Acreditaciones por Facultad</h2>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <div>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            color="Switches"
                                                            onChange={handleFCI3} />}
                                                    label="Mostrar"
                                                />
                                            </FormGroup>
                                        </div>
                                        <Grow in={showI31} unmountOnExit>
                                            <Box>
                                                <Autocomplete
                                                    disablePortal
                                                    id="idF"
                                                    name="idF"
                                                    options={facultades}
                                                    value={facI3}
                                                    sx={{width:550, p: 1}}
                                                    onChange={handleChangeFFI3}
                                                    fullWidth
                                                    //onChange={handleChangeFF}
                                                    //onMouseLeave={mouseLeaveFF}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            {...params}
                                                            label="Facultad"/>}
                                                />
                                            </Box>
                                        </Grow>
                                        <Grow in={showI32} unmountOnExit>
                                            <Box>
                                                <div style={{height: '100%' }}>
                                                    <DataGrid
                                                        style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                                        autoHeight
                                                        rows={acreditacionI3}
                                                        columns={columnasI3}
                                                        pageSize={10}
                                                        rowsPerPageOptions={[10]}
                                                        pagination
                                                        components={{Toolbar: CustomExport}}
                                                        initialState={{
                                                            sorting:{
                                                                sortModel: [{field: 'id', sort: 'asc'}],
                                                            },
                                                        }}
                                                        minHeight={750}
                                                        rowMouseEnter
                                                    />
                                                </div>
                                            </Box>
                                        </Grow>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </>
                </Container>
            </Box>
        </ThemeProvider>
    )
}