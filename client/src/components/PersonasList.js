import {Button, Container} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import {Box} from "@mui/system";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {esES} from '@mui/x-data-grid'
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";



export default function PersonasList(){

    const navigate = useNavigate()

    const [personas, setPersonas] = useState([])
    const [peSel,setPeSel] = useState(null);
    const handleRowClick = (e,v) => {
        setPeSel(e.row)
    }

    const loadPersonas = async () => {
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
                data[i].Sexo = "Masculino";
            }
            else{
                data[i].Sexo = "Femenino";
            }
        }
        setPersonas(data)
    }

    function timeout(delay){
        return new Promise (res => setTimeout(res,delay))
    }


    const columnas = [
        {field: 'id', headerName: 'Codigo', hide: true, flex: 1},
        {field: 'PNombre', headerName: 'Nombre', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>)},
        {field: 'PApellido', headerName: 'Apellido', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>)},
        {field: 'PTipoDocumento', headerName: 'PTipo de Documento', hide: true, flex: 1},
        {field: 'TipoDocumento', headerName: 'Tipo de Documento', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>)},
        {field: 'PNumeroDocumento', headerName: 'Número de Documento', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>)},
        {field: 'PSexo', headerName: 'PSexo', hide: true, flex: 1},
        {field: 'Sexo', headerName: 'Sexo', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>)},
        {field: 'PMail', headerName: 'Mail', minWidth: 200, flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>)},
        {field: 'PNumeroTelefono', headerName: 'Teléfono', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>)},
        {field: 'edit', headerName: 'Editar', flex:1, maxWidth: 70,
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/personas/edit' , {state: {idp: cellValues.id}})}}
                    color="inherit"
                ><HistoryEduIcon /></Button>)}},
        {field: 'delete', headerName: 'Borrar', flex:1, maxWidth: 55,
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/personas/delete' , {state: {idp: cellValues.id}})}}
                    color="inherit"
                ><DeleteIcon /></Button>)}},
    ]


    useEffect(() => {
        loadPersonas()
    }, [])


    return(
        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
            <Container>
                <>
                    <h1> Personas</h1>
                    <Box>
                        <div style={{height: '100%' }}>
                            <DataGrid
                                style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                autoHeight
                                rows={personas}
                                columns={columnas}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                minHeight={750}
                                initialState={{
                                    sorting:{
                                        sortModel: [{field: 'id', sort: 'asc'}],
                                    },
                                }}
                                rowMouseEnter
                                onRowClick={handleRowClick}
                            />
                        </div>
                    </Box>
                </>
                <Toolbar>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" ></Grid>
                        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" >
                            <Button
                                variant='contained'
                                style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8aadb8', color: 'black'}}
                                onClick={() => navigate('/personas/new')}
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