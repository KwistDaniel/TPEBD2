import {Button, Container} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import {Box} from "@mui/system";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {esES} from '@mui/x-data-grid'
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grow from '@mui/material/Grow'
import {useLocation} from "react-router";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";


export default function AcreditacionesList(){
    const {state} = useLocation()
    const {idf,idc} = state;
    const navigate = useNavigate()

    /*Data*/
    const [facultades,setFacultades] = useState([]);
    const [carreras,setCarreras] = useState([]);
    const [fac,setFac] = useState(null);
    const [car,setCar] = useState(null);
    const [showCarreras,setShowCarreras] = useState(false);
    const [showAcreditaciones1,setShowAcreditaciones1] = useState(false);
    const [showAcreditaciones2,setShowAcreditaciones2] = useState(false);
    const [showAcreditaciones3,setShowAcreditaciones3] = useState(false);
    const [acreditacion, setAcreditacion] = useState([])

    /*Loaders*/
    async function loadFacultades(idf){
        const response = await fetch('http://localhost:4000/facultades')
        const data = await response.json()
        var newList =[]
        var objft = {label: 'Todas', id: -1}
        newList.push(objft)
        for( var i=0; i<data.length;i++){
            var obj = {label: data[i].FNombre, id: data[i].id}
            newList.push(obj)
        }
        setFacultades(newList)
        if(idf !== 0){
            var newFac = newList.filter(facultad => facultad.id === idf)
            setFac(newFac[0])
            loadCarreras(idf)
            setShowCarreras(true)
        }
    }

    async function loadCarreras(idFac){
        if(idFac === null){
            setCarreras([])
            setShowAcreditaciones1(false)
            setShowAcreditaciones2(false)
        }
        else{
            const response = await fetch('http://localhost:4000/carreras/' + idFac)
            const data = await response.json()
            var newList = []
            var objct = {label: 'Todas', id: -1}
            newList.push(objct)
            for( var i=0; i<data.length;i++){
                var obj = {label: data[i].CNombre, id: data[i].id}
                newList.push(obj)
            }
            setCarreras(newList)
            if(idc !== 0 ){
                var newCar = newList.filter(carrera => carrera.id === idc)
                setCar(newCar[0])
                loadAcreditaciones(idc)
                state.idc=0; //causa error al guardar valor al volver de instancias o participantes ej y cambiar la facultad o carrera, pq entra por aca.
                setShowAcreditaciones1(true)
            }
        }
    }
    const loadAcreditaciones = async (idCar) => {
        const response = await fetch('http://localhost:4000/acreditaciones/carrera/' + idCar)
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
                obj.AFechaInicio.substring(8,10).toString() +
                String.fromCharCode(47) +
                obj.AFechaInicio.substring(5,7).toString() +
                String.fromCharCode(47) +
                obj.AFechaInicio.substring(0,4).toString()
            )
            obj.AFechaInicio = fi;

            if(obj.AFechaFin !== null){
                var ff = (
                    obj.AFechaFin.substring(8,10).toString() +
                    String.fromCharCode(47) +
                    obj.AFechaFin.substring(5,7).toString() +
                    String.fromCharCode(47) +
                    obj.AFechaFin.substring(0,4).toString()
                )
                obj.AFechaFin = ff;
            }
            newList.push(obj)
        }
        setAcreditacion(newList)
    }

    const loadTodasAcreditaciones = async () => {
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
                obj.AFechaInicio.substring(8,10).toString() +
                String.fromCharCode(47) +
                obj.AFechaInicio.substring(5,7).toString() +
                String.fromCharCode(47) +
                obj.AFechaInicio.substring(0,4).toString()
            )
            obj.AFechaInicio = fi;

            if(obj.AFechaFin !== null){
                var ff = (
                    obj.AFechaFin.substring(8,10).toString() +
                    String.fromCharCode(47) +
                    obj.AFechaFin.substring(5,7).toString() +
                    String.fromCharCode(47) +
                    obj.AFechaFin.substring(0,4).toString()
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
        setAcreditacion(newList)
    }

    const loadTodasAcreditacionesFacultad = async (idf) => {
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
                idF: idf,
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
                dataA[i].AFechaInicio.substring(8,10).toString() +
                String.fromCharCode(47) +
                dataA[i].AFechaInicio.substring(5,7).toString() +
                String.fromCharCode(47) +
                dataA[i].AFechaInicio.substring(0,4).toString()
            )
            obj.AFechaInicio = fi;

            if(dataA[i].AFechaFin !== null){
                var ff = (
                    dataA[i].AFechaFin.substring(8,10).toString() +
                    String.fromCharCode(47) +
                    dataA[i].AFechaFin.substring(5,7).toString() +
                    String.fromCharCode(47) +
                    dataA[i].AFechaFin.substring(0,4).toString()
                )
                obj.AFechaFin = ff;
            }
            const responseC = await fetch('http://localhost:4000/carrera/' + obj.idC)
            const dataC = await responseC.json()
            obj.ANomCar = dataC[0].CNombre;
            newListA.push(obj)
            index++;
        }
        setAcreditacion(newListA)
    }


    /*Handlers*/
    const handleChangeFF = (e,v) => {
        if( v === null ){
            setFac({label: "", id: 0})
            setCar({label: "", id: 0})
            setAcreditacion([])
            setShowCarreras(false)
            setShowAcreditaciones1(false)
            setShowAcreditaciones2(false)
            setShowAcreditaciones3(false)
        }
        else if(v.id === -1){
            setFac(v)
            setCar({label: "", id: -1})
            setAcreditacion([])
            setShowCarreras(false)
            setShowAcreditaciones1(false)
            setShowAcreditaciones2(true)
            setShowAcreditaciones3(false)
            loadTodasAcreditaciones()
        }
        else{
            setFac(v)
            setCar({label: "", id: 0})
            setAcreditacion([])
            setShowCarreras(true)
            setShowAcreditaciones1(false)
            setShowAcreditaciones2(false)
            setShowAcreditaciones3(false)
            loadCarreras(v.id)
        }
    };
    const handleChangeCC = (e,v) => {
        if( v === null ){
            setCar(null)
            setShowAcreditaciones1(false)
            setShowAcreditaciones2(false)
            setShowAcreditaciones3(false)
            setAcreditacion([])
        }
        else if(v.id === -1){
            setCar(v)
            setShowAcreditaciones1(false)
            setShowAcreditaciones2(false)
            setShowAcreditaciones3(true)
            loadTodasAcreditacionesFacultad(fac.id)
        }
        else{
            setCar(v)
            setShowAcreditaciones1(true)
            setShowAcreditaciones2(false)
            setShowAcreditaciones3(false)
            loadAcreditaciones(v.id)
        }
    };

    const columnas1 = [
        {field: 'id', headerName: 'id', flex: 1, hide: true},
        {field: 'idA', headerName: 'idA', flex: 1, hide: true},
        {field: 'ANumeroExpediente', headerName: 'Nº de Expediente', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AConvocatoria', headerName: 'Convocatoria', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaInicio', headerName: 'Inicio', maxWidth: 115, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaFin', headerName: 'Finalización', maxWidth: 105 ,flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AEstado', headerName: 'AEstado', flex: 1, hide: true},
        {field: 'ATipo', headerName: 'ATipo', flex: 1, hide: true, },
        {field: 'Estado', headerName: 'Estado', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'Tipo', headerName: 'Tipo', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )
        },
        {field: 'AObservacionProceso', headerName: 'Obs. del Proceso', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AObservacionFinalizacion', headerName: 'Obs. de la Finalización', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'Instancias', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', renderCell: (cellValues) => {return (<Button variant='text'
                                                                                    style={{color: 'black'}}
                                                                                    onClick={() => {navigate('/instancias/list' , {state: {ida: cellValues.row.idA, idf: fac.id,idc: car.id}})}}
                                                                            >Ver</Button>)}},
        {field: 'Participantes', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', renderCell: (cellValues) => {return (<Button
                                                                                    variant='text'
                                                                                    style={{color: 'black'}}
                                                                                    onClick={(e) => {navigate('/participantes/list', {state: {ida: cellValues.row.idA, idf: fac.id,idc: car.id}})}}
                                                                                >Ver</Button>)}},
        {field: 'idC', headerName: 'Carrera', flex: 1, hide: true},
        {field: 'edit', headerName: 'Editar', flex:1, maxWidth: 70, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/acreditaciones/edit' , {state: {ida: cellValues.row.idA,idf: fac.id, idc:car.id}})}}
                    color="inherit"
                ><HistoryEduIcon /></Button>)}},
        {field: 'delete', headerName: 'Borrar', flex:1, maxWidth: 55, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/acreditaciones/delete' , {state: {ida: cellValues.row.idA,idf: fac.id, idc:car.id}})}}
                    color="inherit"
                ><DeleteIcon /></Button>)}},
    ]

    const columnas2 = [
        {field: 'id', headerName: 'id', flex: 1, hide: true},
        {field: 'idA', headerName: 'idA', flex: 1, hide: true},
        {field: 'ANumeroExpediente', headerName: 'Nº de Expediente', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AConvocatoria', headerName: 'Convocatoria', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaInicio', headerName: 'Inicio', maxWidth: 115, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaFin', headerName: 'Finalización', maxWidth: 105 ,flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AEstado', headerName: 'AEstado', flex: 1, hide: true},
        {field: 'ATipo', headerName: 'ATipo', flex: 1, hide: true, },
        {field: 'Estado', headerName: 'Estado', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'Tipo', headerName: 'Tipo', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )
        },
        {field: 'AObservacionProceso', headerName: 'Obs. del Proceso', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AObservacionFinalizacion', headerName: 'Obs. de la Finalización', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'Instancias', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', renderCell: (cellValues) => {return (<Button variant='text'
                                                                                                                                                       style={{color: 'black'}}
                                                                                                                                                       onClick={() => {navigate('/instancias/list' , {state: {ida: cellValues.row.idA, idf: cellValues.row.idF,idc: cellValues.row.idC}})}}
            >Ver</Button>)}},
        {field: 'Participantes', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', renderCell: (cellValues) => {return (<Button
                variant='text'
                style={{color: 'black'}}
                onClick={(e) => {navigate('/participantes/list', {state: {ida: cellValues.row.idA, idf: cellValues.row.idF,idc: cellValues.row.idC}})}}
            >Ver</Button>)}},
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
        {field: 'edit', headerName: 'Editar', flex:1, maxWidth: 70, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/acreditaciones/edit' , {state: {ida: cellValues.row.idA,idf: cellValues.row.idF, idc: cellValues.row.idC}})}}
                    color="inherit"
                ><HistoryEduIcon /></Button>)}},
        {field: 'delete', headerName: 'Borrar', flex:1, maxWidth: 55, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/acreditaciones/delete' , {state: {ida: cellValues.row.idA,idf: cellValues.row.idF, idc: cellValues.row.idC}})}}
                    color="inherit"
                ><DeleteIcon /></Button>)}},
    ]

    const columnas3 = [
        {field: 'id', headerName: 'id', flex: 1, hide: true},
        {field: 'idA', headerName: 'idA', flex: 1, hide: true},
        {field: 'ANumeroExpediente', headerName: 'Nº de Expediente', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AConvocatoria', headerName: 'Convocatoria', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaInicio', headerName: 'Inicio', maxWidth: 115, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AFechaFin', headerName: 'Finalización', maxWidth: 105 ,flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AEstado', headerName: 'AEstado', flex: 1, hide: true},
        {field: 'ATipo', headerName: 'ATipo', flex: 1, hide: true, },
        {field: 'Estado', headerName: 'Estado', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'Tipo', headerName: 'Tipo', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )
        },
        {field: 'AObservacionProceso', headerName: 'Obs. del Proceso', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'AObservacionFinalizacion', headerName: 'Obs. de la Finalización', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'Instancias', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', renderCell: (cellValues) => {return (<Button variant='text'
                                                                                                                                                       style={{color: 'black'}}
                                                                                                                                                       onClick={() => {navigate('/instancias/list' , {state: {ida: cellValues.row.idA, idf: cellValues.row.idF,idc: cellValues.row.idC}})}}
            >Ver</Button>)}},
        {field: 'Participantes', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', renderCell: (cellValues) => {return (<Button
                variant='text'
                style={{color: 'black'}}
                onClick={(e) => {navigate('/participantes/list', {state: {ida: cellValues.row.idA, idf: cellValues.row.idF,idc: cellValues.row.idC}})}}
            >Ver</Button>)}},
        {field: 'idF', headerName: 'FacultadC', flex: 1, hide: true},
        {field: 'idC', headerName: 'CarreraC', flex: 1, hide: true},
        {field: 'ANomCar', headerName: 'Carrera', flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'edit', headerName: 'Editar', flex:1, maxWidth: 70, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/acreditaciones/edit' , {state: {ida: cellValues.row.idA,idf: cellValues.row.idF, idc: cellValues.row.idC}})}}
                    color="inherit"
                ><HistoryEduIcon /></Button>)}},
        {field: 'delete', headerName: 'Borrar', flex:1, maxWidth: 55, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/acreditaciones/delete' , {state: {ida: cellValues.row.idA,idf: cellValues.row.idF, idc: cellValues.row.idC}})}}
                    color="inherit"
                ><DeleteIcon /></Button>)}},
    ]

    useEffect(() => {
        loadFacultades(idf)
    }, [idf])


    return(
        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
            <Container>
                <>
                    <h1> Procesos de Acreditación</h1>
                    <Box
                        sx={{
                            '& .super-app-theme--header': {
                                backgroundColor: '#688A81',
                            },
                        }}
                    >
                        <Autocomplete
                            disablePortal
                            id="idF"
                            name="idF"
                            options={facultades}
                            value={fac}
                            sx={{width:550, p: 1}}
                            onChange={handleChangeFF}
                            fullWidth
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Facultad"/>}
                        />
                        <Grow in={showCarreras} unmountOnExit>
                            <Autocomplete
                                disablePortal
                                id="idC"
                                name="idC"
                                options={carreras}
                                value={car}
                                sx={{width:550, p: 1}}
                                onChange={handleChangeCC}
                                fullWidth
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        label="Carrera"/>}
                            />
                        </Grow>
                        <Grow in={showAcreditaciones1} unmountOnExit>
                            <div style={{height: '100%' }}>
                                <DataGrid
                                    style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    autoHeight
                                    rows={acreditacion}
                                    columns={columnas1}
                                    pageSize={15}
                                    rowsPerPageOptions={[15]}
                                    minHeight={750}
                                    rowMouseEnter
                                />
                            </div>
                        </Grow>
                        <Grow in={showAcreditaciones2} unmountOnExit>
                            <div style={{height: '100%' }}>
                                <DataGrid
                                    style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    autoHeight
                                    rows={acreditacion}
                                    columns={columnas2}
                                    pageSize={15}
                                    rowsPerPageOptions={[15]}
                                    minHeight={750}
                                    rowMouseEnter
                                />
                            </div>
                        </Grow>
                        <Grow in={showAcreditaciones3} unmountOnExit>
                            <div style={{height: '100%' }}>
                                <DataGrid
                                    style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    autoHeight
                                    rows={acreditacion}
                                    columns={columnas3}
                                    pageSize={15}
                                    rowsPerPageOptions={[15]}
                                    minHeight={750}
                                    rowMouseEnter
                                />
                            </div>
                        </Grow>
                    </Box>
                    <Box>
                        <Toolbar>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}></Grid>
                                <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" >
                                    <Grow in={!(car === null || car.id === 0 || fac.id === -1)}>
                                        <Button
                                            variant='contained'
                                            style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8aadb8', color: 'black'}}
                                            onClick={() => navigate('/acreditaciones/new', {state: {idf: fac.id, idc:car.id}})}
                                            startIcon={<AddCircleOutlineOutlinedIcon />}
                                        >
                                            Agregar
                                        </Button>
                                    </Grow>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </Box>
                </>
            </Container>
        </Box>
    )
}