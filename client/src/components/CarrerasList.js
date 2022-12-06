import {Button, Container} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import {Box} from "@mui/system";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {esES} from '@mui/x-data-grid'
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grow from '@mui/material/Grow'
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import {useLocation} from "react-router";
import Tooltip from "@mui/material/Tooltip";

export default function Carreras(){
    const {state} = useLocation()
    const {idf} = state;
    const [facultades,setFacultades] = useState({label: '', id: 0});
    const [carreras,setCarreras] = useState([])
    const [fac,setFac] = useState(null);
    const [showCarreras,setShowCarreras] = useState(false);

    /*Loaders*/
    async function loadFacultades(){
        const response = await fetch('http://localhost:4000/facultades')
        const data = await response.json()
        var newList =[]
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


    /*Handlers*/
    const handleChangeFF = (e,v) => {
        if( v === null ){
            setFac({label: '', id: 0})
            setShowCarreras(false)
        }
        else{
            setFac(v)
            setShowCarreras(true)
            loadCarreras(v.id)
        }
    };


    const navigate = useNavigate()
    const loadCarreras = async (idFac) => {
        const response = await fetch('http://localhost:4000/carreras/' + idFac)
        const data = await response.json()
        for( var i=0;i<data.length;i++){
            if(data[i].CTipo === "G") {
                data[i].CTipo = "Grado";
            }
            else if (data[i].CTipo === "P"){
                data[i].CTipo = "Posgrado";
            }
        }
        setCarreras(data)
    }

    const columnas = [
        {field: 'id', headerName: 'Codigo', flex: 1, hide: true},
        {field: 'CNombre', headerName: 'Nombre',flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'CTipo', headerName: 'Tipo', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'CObservacion', headerName: 'Observación', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'CDepartamento', headerName: 'Departamento', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'edit', headerName: 'Editar', flex:1, maxWidth: 70,
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/carreras/edit' , {state: {idf: fac.id, idc: cellValues.id}})}}
                    color="inherit"
                ><HistoryEduIcon /></Button>)}},
        {field: 'delete', headerName: 'Borrar', flex:1, maxWidth: 55,
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/carreras/delete' , {state: {idf: fac.id, idc: cellValues.id}})}}
                    color="inherit"
                ><DeleteIcon /></Button>)}},
    ]


    useEffect(() => {
        loadFacultades()
    }, [])


    return(
        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
            <Container>
                <>
                    <h1> Carreras </h1>
                    <Box>
                        <Autocomplete
                            disablePortal
                            id="idF"
                            name="idF"
                            options={facultades}
                            value={fac}
                            sx={{width:450, p: 1}}
                            onChange={handleChangeFF}
                            fullWidth
                            //onChange={handleChangeFF}
                            //onMouseLeave={mouseLeaveFF}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Facultad"/>}
                        />
                    </Box>
                    <Box>
                        <Grow in={showCarreras} unmountOnExit>
                            <div style={{height: '100%' }}>
                                <DataGrid
                                    style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    autoHeight
                                    rows={carreras}
                                    columns={columnas}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    initialState={{
                                        sorting:{
                                            sortModel: [{field: 'id', sort: 'asc'}],
                                        },
                                    }}
                                    minHeight={750}
                                />
                            </div>
                        </Grow>
                    </Box>
                </>
                <Toolbar>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" ></Grid>
                        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" >
                            <Grow in={!(fac === null || fac.id === 0)}>
                                <Button
                                    variant='contained'
                                    style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8aadb8', color: 'black'}}
                                    onClick={() => navigate('/carreras/new', {state: {idf: fac.id}})}
                                    startIcon={<AddCircleOutlineOutlinedIcon />}
                                >
                                    Agregar
                                </Button>
                            </Grow>
                        </Grid>
                    </Grid>
                </Toolbar>
            </Container>
        </Box>
    )
}