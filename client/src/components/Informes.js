import {Button, Container} from "@mui/material";
import PropTypes from 'prop-types';
import {Box} from "@mui/system";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';
import {esES, GridPrintExportMenuItem} from '@mui/x-data-grid'
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
    const [showI33,setShowI33] = useState(false);
    const [acreditacionI1, setAcreditacionI1] = useState([])
    const [acreditacionI2, setAcreditacionI2] = useState([])
    const [acreditacionI3, setAcreditacionI3] = useState([])

    /*Loaders*/
    async function preCarga(){
        const responseF = await fetch('http://localhost:4000/facultades')
        const dataF = await responseF.json()
        var newListF =[]
        var objf = {label: 'Todas', id: -1}
        newListF.push(objf)
        for( var i=0; i<dataF.length;i++){
            var objf = {label: dataF[i].FNombre, id: dataF[i].id}
            newListF.push(objf)
        }
        setFacultades(newListF)


        const responseA = await fetch('http://localhost:4000/acreditaciones')
        const dataA = await responseA.json()
        var newListA = []
        for(var j=0;j<dataA.length;j++){
            var obj = {
                id: dataA[j].id,
                ANumeroExpediente: dataA[j].ANumeroExpediente,
                AConvocatoria: dataA[j].AConvocatoria,
                AFechaInicio: dataA[j].AFechaInicio,
                AFechaFin: dataA[j].AFechaFin,
                AEstado: dataA[j].AEstado,
                ATipo: dataA[j].ATipo,
                AObservacionProceso: dataA[j].AObservacionProceso,
                AObservacionFinalizacion: dataA[j].AObservacionFinalizacion,
                idC: dataA[j].idC,
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
            const responseCar = await fetch('http://localhost:4000/carrera/' + obj.idC)
            const dataCar = await responseCar.json()
            obj.ANomCar = dataCar[0].CNombre;
            obj.idF = dataCar[0].idF;
            const responseFac = await fetch('http://localhost:4000/facultad/' + dataCar[0].idF)
            const dataFac = await responseFac.json()
            obj.ANomFac = dataFac[0].FNombre;
            newListA.push(obj)
        }

        var ac1 = newListA.filter(ac => ac.AEstado === 1)
        var ac2 = newListA.filter(ac => ac.AFechaFin === '')

        setAcreditacionI1(ac1)
        setAcreditacionI2(ac2)
    }

    const loadAcreditacionesI3 = async (idf) => {
        var newListA = []
        var index=1;
        const responseA = await fetch('http://localhost:4000/acreditaciones/facultad/' + idf)
        const dataA = await responseA.json()
        for(var i=0;i<dataA.length;i++){
            var obj = {
                id: index,
                idA: dataA[i].id,
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
            var fi = (
                dataA[i].AFechaInicio.substring(0,4).toString() +
                String.fromCharCode(47) +
                dataA[i].AFechaInicio.substring(5,7).toString() +
                String.fromCharCode(47) +
                dataA[i].AFechaInicio.substring(8,10).toString()
            )
            obj.AFechaInicio = fi;

            if(dataA[i].AFechaFin !== null){
                var ff = (
                    dataA[i].AFechaFin.substring(0,4).toString() +
                    String.fromCharCode(47) +
                    dataA[i].AFechaFin.substring(5,7).toString() +
                    String.fromCharCode(47) +
                    dataA[i].AFechaFin.substring(8,10).toString()
                )
                obj.AFechaFin = ff;
            }
            const responseCar = await fetch('http://localhost:4000/carrera/' + obj.idC)
            const dataCar = await responseCar.json()
            obj.ANomCar = dataCar[0].CNombre;

            newListA.push(obj)
            index++;
        }
        setAcreditacionI3(newListA)
    }
    const loadTodasAcreditacionesI3 = async () => {
        const response = await fetch('http://localhost:4000/acreditaciones')
        const dataA = await response.json()
        var newList = []
        for( var j=dataA.length-1;j>=0;j--){
            var obj = {
                id: j,
                idA: dataA[j].id,
                ANumeroExpediente: dataA[j].ANumeroExpediente,
                AConvocatoria: dataA[j].AConvocatoria,
                AFechaInicio: dataA[j].AFechaInicio,
                AFechaFin: dataA[j].AFechaFin,
                AEstado: dataA[j].AEstado,
                ATipo: dataA[j].ATipo,
                AObservacionProceso: dataA[j].AObservacionProceso,
                AObservacionFinalizacion: dataA[j].AObservacionFinalizacion,
                idC: dataA[j].idC,
            }
            if(obj.AEstado === 1){
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

            var fi = (
                obj.AFechaInicio.substring(0,4).toString() +
                String.fromCharCode(47) +
                obj.AFechaInicio.substring(5,7).toString() +
                String.fromCharCode(47) +
                obj.AFechaInicio.substring(8,10).toString()
            )
            obj.AFechaInicio = fi;

            if(obj.AFechaFin !== null){
                var ff = (
                    obj.AFechaFin.substring(0,4).toString() +
                    String.fromCharCode(47) +
                    obj.AFechaFin.substring(5,7).toString() +
                    String.fromCharCode(47) +
                    obj.AFechaFin.substring(8,10).toString()
                )
                obj.AFechaFin = ff;
            }

            const responseC = await fetch('http://localhost:4000/carrera/' + obj.idC)
            const dataC = await responseC.json()
            obj.ANomCar = dataC[0].CNombre;
            obj.idF = dataC[0].idF;
            const responseF = await fetch('http://localhost:4000/facultad/' + dataC[0].idF)
            const dataF = await responseF.json()
            obj.ANomFac = dataF[0].FNombre;

            newList.push(obj)
        }
        setAcreditacionI3(newList)
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
            setShowI33(false)
        }
        else if(v.id === -1){
            setFacI3(v)
            setAcreditacionI3([])
            setShowI32(false)
            setShowI33(true)
            loadTodasAcreditacionesI3()
        }
        else{
            setFacI3(v)
            setShowI32(true)
            setShowI33(false)
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
        {field: 'AFechaInicio', headerName: 'Fecha de Inicio', maxWidth: 115, flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaFin', headerName: 'Fecha de Fin', maxWidth: 105 ,flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
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
        {field: 'idF', headerName: 'FacultadC', flex: 1, hide: true},
        {field: 'idC', headerName: 'CarreraC', flex: 1, hide: true},
        {field: 'ANomFac', headerName: 'Facultad', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'ANomCar', headerName: 'Carrera', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
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
        {field: 'AFechaInicio', headerName: 'Fecha de Inicio', maxWidth: 115, flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaFin', headerName: 'Fecha de Fin', maxWidth: 105 ,flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
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
        {field: 'idF', headerName: 'FacultadC', flex: 1, hide: true},
        {field: 'idC', headerName: 'CarreraC', flex: 1, hide: true},
        {field: 'ANomFac', headerName: 'Facultad', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'ANomCar', headerName: 'Carrera', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
    ]
    const columnasI31 = [
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
        {field: 'AFechaInicio', headerName: 'Fecha de Inicio', maxWidth: 115, flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaFin', headerName: 'Fecha de Fin', maxWidth: 105 ,flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
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
        {field: 'idF', headerName: 'FacultadC', flex: 1, hide: true},
        {field: 'idC', headerName: 'CarreraC', flex: 1, hide: true},
        {field: 'ANomFac', headerName: 'Facultad', flex: 1, hide: true, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'ANomCar', headerName: 'Carrera', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
    ]
    const columnasI32 = [
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
        {field: 'AFechaInicio', headerName: 'Fecha de Inicio', maxWidth: 115, flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaFin', headerName: 'Fecha de Fin', maxWidth: 105 ,flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
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
        {field: 'idF', headerName: 'FacultadC', flex: 1, hide: true},
        {field: 'idC', headerName: 'CarreraC', flex: 1, hide: true},
        {field: 'ANomFac', headerName: 'Facultad', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'ANomCar', headerName: 'Carrera', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
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
                                                        columns={columnasI31}
                                                        pageSize={10}
                                                        rowsPerPageOptions={[10]}
                                                        pagination
                                                        components={{Toolbar: CustomExport}}
                                                        minHeight={750}
                                                        rowMouseEnter
                                                    />
                                                </div>
                                            </Box>
                                        </Grow>
                                        <Grow in={showI33} unmountOnExit>
                                            <Box>
                                                <div style={{height: '100%' }}>
                                                    <DataGrid
                                                        style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                                        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                                        autoHeight
                                                        rows={acreditacionI3}
                                                        columns={columnasI32}
                                                        pageSize={10}
                                                        rowsPerPageOptions={[10]}
                                                        pagination
                                                        components={{Toolbar: CustomExport}}
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