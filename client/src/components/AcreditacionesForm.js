import {Button, Card, Grid, Typography} from '@mui/material'
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import React, {useState} from 'react';
import {MobileDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Autocomplete from '@mui/material/Autocomplete'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from "@mui/material/FormControlLabel";
import CheckBox from "@mui/material/Checkbox";



export default function AcreditacionesForm(){

    const [dateFI,setDateFI] = React.useState(dayjs);
    const [dateFF,setDateFF] = React.useState(dayjs);

    const [checkedFF, setCheckedFF] = React.useState(false);

    const [dateSelectorFF, setdateSelectorFF] = React.useState(false);

    const [acreditacion, setAcreditacion] = useState({
        numeroExpediente: "",
        convocatoria: "",
        fechaInicio: dateFI.toString(),
        fechaFin: "",
    })

    const facultades = [
        {label: 'FCFMYN', id: 1},
        {label: 'FIUBA', id: 2},
    ]



    const handleSubmit = async e => {
        e.preventDefault();

        console.log(acreditacion);

        const resid = await fetch('http://localhost:4000/tasks/ids',{
            method: 'GET'
        })

        const dataid = await resid.json();
        console.log(dataid);

        const res = await fetch('http://localhost:4000/altaAcreditacion', {
            method: 'POST',
            body: JSON.stringify(acreditacion),
            headers: {'Content-Type': 'application/json'},
        })

        const data = await res.json();
        console.log(data);

        //navigate('/') Para vovler al inicio, ponerle que vaya a listar acreds
    };

    const handleChange = e =>
        setAcreditacion({...acreditacion, [e.target.name]: e.target.value});

    const handleChangeFechaInicio = (newValue) => {
        setDateFI(newValue);
        setAcreditacion({...acreditacion, 'fechaInicio': (newValue).format('DD/MM/YYYY')});
    };

    const handleChangeFechaFin = (newValue) => {
        setDateFF(newValue);
        setAcreditacion({...acreditacion, 'fechaFin': newValue.toString()});
    };

    const handleChangeCheckboxFechaFin = e => {
        setCheckedFF(e.target.checked);
        setdateSelectorFF(e.target.checked);
        if(e.target.checked === true){
            setAcreditacion({...acreditacion, 'fechaFin': dateFF.toString()});
        }
        else{
            setAcreditacion({...acreditacion, 'fechaFin': ''});
        }


    };

    return(
        <Grid
            container
            direction='column'
            alignItems='center'
            justifyContent='center'
            spacing={5}
        >
            <Grid item xs={3}>
                {/*son columnas por defecto, con esto uso 3*/}
                <Card
                    sx={{mt:5}} style={{backgroundColor: '#7dcfb6',
                    padding: '1rem'}}
                >
                    <Typography variant='5' textAlign='center' color='black'>
                        Crear Acreditacion
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <CardContent
                            direction='column'
                            alignItems='center'
                            justifyContent='center'
                            spacing={5}
                        >
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    variant='filled'
                                    label='Numero de Expediente'
                                    sx={{width:300, p: 1, display: 'block'}}

                                    name='numeroExpediente'
                                    onChange={handleChange}
                                    inputProps={{style: {color: 'black'}}}
                                    InputLabelProps={{style: {color: 'black'}}}
                                />
                                <TextField
                                    variant='filled'
                                    label='Convocatoria'
                                    multiline
                                    rows={3}
                                    sx={{width:300, p: 1, display: 'block'}}

                                    name='convocatoria'
                                    onChange={handleChange}
                                    inputProps={{style: {color: 'black'}}}
                                    InputLabelProps={{style: {color: 'black'}}}
                                />
                                <MobileDatePicker
                                    disableFuture
                                    variant='filled'
                                    label="Fecha de Inicio"
                                    inputFormat="DD/MM/YYYY"
                                    value={dateFI}
                                    sx={{width:300, p: 1, display: 'block'}}
                                    name='fechaInicio'
                                    onChange={handleChangeFechaInicio}
                                    inputProps={{style: {color: 'black'}}}
                                    InputLabelProps={{style: {color: 'black'}}}
                                    renderInput={(params) => <TextField
                                        {...params}
                                        sx={{width:200, p: 1}}
                                    />}
                                />
                                <FormGroup>
                                    <FormControlLabel
                                        control={<CheckBox
                                            checked={checkedFF}
                                            onChange={handleChangeCheckboxFechaFin}

                                        />}
                                        label='Incluir Fecha de Fin'
                                    />
                                </FormGroup>
                                <MobileDatePicker
                                    disabled={!dateSelectorFF}
                                    variant='filled'
                                    label="Fecha de Fin"
                                    inputFormat="DD/MM/YYYY"
                                    value={dateFF}
                                    sx={{width:200, m: 1, display: 'block'}}
                                    name='fechaFin'
                                    onChange={handleChangeFechaFin}
                                    inputProps={{style: {color: 'black'}}}
                                    InputLabelProps={{style: {color: 'black'}}}
                                    renderInput={(params) => <TextField
                                        {...params}
                                        sx={{width:200, p: 1}}/>}
                                />
                                <Autocomplete
                                    disablePortal
                                    id="comboBoxTipo"
                                    options={facultades}
                                    sx={{width:200, p: 1}}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Tipo"/>}
                                />
                                <Autocomplete
                                    disablePortal
                                    id="comboBoxEstado"
                                    options={facultades}
                                    sx={{width:200, p: 1}}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Estado"/>}
                                />
                                <Autocomplete
                                    disablePortal
                                    id="comboBoxFacultad"
                                    options={facultades}
                                    sx={{width:200, p: 1}}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Facultad"/>}
                                />
                                <Autocomplete
                                    disablePortal

                                    id="comboBoxDepartamento"
                                    options={facultades}
                                    sx={{width:200, p: 1}}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Departamento"/>}
                                />
                                <Autocomplete
                                    disablePortal
                                    id="comboBoxCarrera"
                                    options={facultades}
                                    sx={{width:200, p: 1}}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Facultad"/>}
                                />
                                <Button
                                    variant= 'contained'
                                    color= 'primary'
                                    type='submit'
                                    sx={{p: 1}}
                                    style={{backgroundColor: 'green', color: 'white'}}
                                    disabled={!acreditacion.convocatoria || !acreditacion.numeroExpediente}
                                >
                                    Confirmar
                                </Button>
                            </form>
                        </CardContent>
                    </LocalizationProvider>
                </Card>
            </Grid>
        </Grid>
    )
}