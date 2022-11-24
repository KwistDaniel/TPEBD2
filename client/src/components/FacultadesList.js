import {Button, Container} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import {Box} from "@mui/system";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {esES} from '@mui/x-data-grid'
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";


export default function FacultadesList(){
    const [facultades,setFacultades] = useState([]);

    /*Loaders*/
    async function loadFacultades(){
        const response = await fetch('http://localhost:4000/facultades')
        const data = await response.json()
        setFacultades(data)
    }

    const navigate = useNavigate()

    const columnas = [
        {field: 'id', headerName: 'Codigo', flex: 1, hide: true},
        {field: 'FNombre', headerName: 'Nombre', flex: 1,
            renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )}
    ]


    useEffect(() => {
        loadFacultades()
    }, [])


    return(
        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
            <Container>
                <>
                    <h1> Facultades </h1>
                    <Box>
                        <div style={{height: '100%' }}>
                            <DataGrid
                                style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                autoHeight
                                rows={facultades}
                                columns={columnas}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                minHeight={750}
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
                                onClick={() => navigate('/facultades/new')}
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