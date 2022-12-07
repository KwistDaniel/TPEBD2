import {Button, Container} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import {Box, styled} from "@mui/system";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {esES} from '@mui/x-data-grid'
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import {DataGrid as MuiDataGrid} from "@mui/x-data-grid/DataGrid/DataGrid";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import DeleteIcon from "@mui/icons-material/Delete";

const DataGrid = styled(MuiDataGrid)(({ theme }) => ({
    "& .MuiDataGrid-columnHeaders": { display: "none" },
    "& .MuiDataGrid-virtualScroller": { marginTop: "0!important" },
}));

export default function TipInsList(){
    const [tiposInstancia,setTiposInstancia] = useState([]);

    /*Loaders*/
    async function loadTiposInstancia(){
        const response = await fetch('http://localhost:4000/tipoInstancia')
        const data = await response.json()
        setTiposInstancia(data)
    }

    const navigate = useNavigate()

    const columnas = [
        {field: 'id', headerName: 'Codigo', flex: 1, hide: true},
        {field: 'TITipo', headerName: 'Tipo de Instancia', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'edit', headerName: 'Editar', flex:1, maxWidth: 70, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/tipins/edit' , {state: {idti: cellValues.row.id}})}}
                    color="inherit"
                ><HistoryEduIcon /></Button>)}},
        {field: 'delete', headerName: 'Borrar', flex:1, hide: true, maxWidth: 55, headerAlign: 'center', headerClassName: 'super-app-theme--header',
            renderCell: (cellValues) => {return (
                <Button
                    onClick={() => {navigate('/tipins/delete' , {state: {idti: cellValues.row.id}})}}
                    color="inherit"
                ><DeleteIcon /></Button>)}},
    ]


    useEffect(() => {
        loadTiposInstancia()
    }, [])


    return(
        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
            <Container>
                <>
                    <h1> Tipos de Instancia </h1>
                    <Box>
                        <div style={{height: '100%' }}>
                            <DataGrid
                                style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                autoHeight
                                rows={tiposInstancia}
                                columns={columnas}
                                pageSize={10}
                                rowsPerPageOptions={[5]}
                                minHeight={750}
                            />
                        </div>
                    </Box>
                </>
                <Toolbar>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}></Grid>
                        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" ><Button
                            variant='contained'
                            style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8a96b8', color: 'black'}}
                            onClick={() => navigate('/tipins/new')}
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