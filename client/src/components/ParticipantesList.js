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
import {useLocation} from "react-router";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";



export default function ParticipantesList(){
    const {state} = useLocation()
    const {ida,idf,idc} = state;
    const navigate = useNavigate()

    const [personas, setPersonas] = useState([])
    const [peSel,setPeSel] = useState(null);
    const [fac,setFac] = useState("");
    const [car,setCar] = useState("");
    const [ac,setAc] = useState("")
    const handleRowClick = (e,v) => {
        setPeSel(e.row)
    }

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
    const loadParticipantes = async (ida) => {
        const responsePar = await fetch('http://localhost:4000/participa/' + ida)
        const dataPar = await responsePar.json()
        const responseRoles = await fetch('http://localhost:4000/roles')
        const dataRoles = await responseRoles.json()
        var newList=[]
        for(var i=0;i<dataPar.length;i++){
            const responseP = await fetch('http://localhost:4000/persona/'+ dataPar[i].idP)
            const dataP = await responseP.json()
            const responseR = await fetch('http://localhost:4000/rol/'+ dataPar[i].idR)
            const dataR = await responseR.json()
            if(dataP.length !== 0){
                var obj = {
                    id: dataP[0].id,
                    PNombre: dataP[0].PNombre,
                    PApellido: dataP[0].PApellido,
                    PTipoDocumento: dataP[0].PTipoDocumento,
                    PNumeroDocumento: dataP[0].PNumeroDocumento,
                    PSexo: dataP[0].PSexo,
                    PMail: dataP[0].PMail,
                    PNumeroTelefono: dataP[0].PNumeroTelefono,
                    rol: dataR[0].rol,
                }
                for(var j=0;j<dataRoles.length;j++){
                    if(obj.rol === dataRoles[j].id){
                        obj.rol = dataRoles[j].rol;
                    }
                }
                newList.push(obj)
            }
        }

        for( var i=0;i<newList.length;i++){
            if(newList[i].PTipoDocumento === 1) {
                newList[i].TipoDocumento = "DNI";
            }
            else if(newList[i].PTipoDocumento === 2){
                newList[i].TipoDocumento = "LE";
            }
            else if(newList[i].PTipoDocumento === 3){
                newList[i].TipoDocumento = "LC";
            }
            else{
                newList[i].TipoDocumento = "CI";
            }
            if(newList[i].PSexo === 1){
                newList[i].Sexo = "Masculino";
            }
            else{
                newList[i].Sexo = "Femenino";
            }
        }
        setPersonas(newList)
    }

    function timeout(delay){
        return new Promise (res => setTimeout(res,delay))
    }

    const handleClick = async (e, v) => {
        await timeout(1000)
        console.log("hacer algo con la rowSel")
        console.log(peSel)
        console.log(peSel.id)
    }

    const columnas = [
        {field: 'id', headerName: 'Codigo', hide: true, flex: 1},
        {field: 'PNombre', headerName: 'Nombre', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PApellido', headerName: 'Apellido', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PTipoDocumento', headerName: 'PTipo de Documento', hide: true, flex: 1},
        {field: 'TipoDocumento', headerName: 'Tipo de Documento', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PNumeroDocumento', headerName: 'Numero de Documento', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PSexo', headerName: 'PSexo', hide: true, flex: 1},
        {field: 'Sexo', headerName: 'Sexo', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PMail', headerName: 'Mail', minWidth: 200, flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'rol', headerName: 'Rol', minWidth: 150, flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
        {field: 'PNumeroTelefono', headerName: 'Telefono', flex: 1, renderCell: (params) => (
                <Tooltip title={params.value} >
                    <span >{params.value}</span>
                </Tooltip>
            )},
    ]


    useEffect(() => {
        loadFacultad(idf)
        loadCarrera(idc)
        loadAcreditacion(ida)
        loadParticipantes(ida)
    }, [ida])


    return(
        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
            <Container>
                <>
                    <h1> Participantes</h1>
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
                                rows={personas}
                                columns={columnas}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                minHeight={750}
                                initialState={{
                                    sorting:{
                                        sortModel: [{field: 'AFechaInicio', sort: 'asc'}],
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
                        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-start" >
                            <Button
                                variant='contained'
                                style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8aadb8', color: 'black'}}
                                onClick={() => {navigate('/acreditaciones' , {state: {idf: idf, idc: idc}})}}
                                startIcon={<ArrowBackIcon />}
                            >
                                Volver
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" >
                            <Button
                                variant='contained'
                                style={{marginRight: '.5rem',marginLeft: '.5rem', backgroundColor: '#8aadb8', color: 'black'}}
                                onClick={() => {navigate('/participantes/edit' , {state: {ida: ida, idf: idf, idc: idc}})}}
                            >
                                Editar
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </Container>
        </Box>
    )
}