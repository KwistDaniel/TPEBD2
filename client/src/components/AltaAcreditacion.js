import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {LocalizationProvider, MobileDatePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CheckBox from "@mui/material/Checkbox";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";









const steps = ['Carrera', 'Acreditacion', 'Participantes','Instancia'];


const theme = createTheme();

export default function Checkout() {

    /**
     * Case 0:
     */
    /*Estructuras*/
    const [facultades,setFacultades] = useState(null);
    const [carreras,setCarreras] = useState(null);
    const [fac,setFac] = useState(null);
    const [car,setCar] = useState(null);

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
    }
    async function loadCarreras(idFac){
        if(idFac === null){
            setCarreras([])
        }
        else{
            const response = await fetch('http://localhost:4000/carreras/' + idFac)
            const data = await response.json()
            var newList = []
            for( var i=0; i<data.length;i++){
                var obj = {label: data[i].CNombre, id: data[i].id}
                newList.push(obj)
            }
            setCarreras(newList)
        }
    }

    /*Handlesr*/
    const handleChangeFF = (e,v) => {
        if( v === null ){
            setFac(null)
            setCarreras([])
        }
        else{
            setFac(v)
            loadCarreras(v.id)
        }
    };
    const handleChangeCC = (e,v) => {
        if( v === null ){
            setCar(null)
            setAcreditacion({...acreditacion, 'idC': null})
        }
        else{
            setCar(v)
            setAcreditacion({...acreditacion, 'idC': v.id})
        }
    };


    /**
     * Case 1:
     */
    /*Estructuras*/
    const [dateFI,setDateFI] = React.useState(dayjs);
    const [dateFF,setDateFF] = React.useState(dayjs);
    const [tipoAc,setTipoAc] = useState(null);
    const [estadoAc,setEstadoAc] = useState(null);
    const [acreditacion, setAcreditacion] = useState({
        numeroExpediente: "",
        convocatoria: "",
        fechaInicio: dateFI.toString(),
        fechaFin: "",
        tipo: "",
        estado: "",
        idC: null,
    })
    const [checkedFF, setCheckedFF] = React.useState(false);
    const [dateSelectorFF, setdateSelectorFF] = React.useState(false);
    const tipo = [
        {label: 'Nueva', id: 1},
        {label: 'En Funcionamiento', id: 2},
    ]

    const estado = [
        {label: 'Vigente', id: 1},
        {label: 'Finalizado', id: 2},
        {label: 'Falla', id: 3},
    ]

    /*Handlers*/
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
    const handleChangeAc = e =>{
        (setAcreditacion({...acreditacion, [e.target.name]: e.target.value}));
    }

    const handleChangeAcTi = (e,v) => {
        if( v === null ){
            setTipoAc(null)
            setAcreditacion({...acreditacion, 'tipo': null});
        }
        else{
            setTipoAc(v)
            setAcreditacion({...acreditacion, 'tipo': v.id});
        }
    };

    const handleChangeAcEs = (e,v) => {
        if( v === null ){
            setEstadoAc()
            setAcreditacion({...acreditacion, 'estado': null});
        }
        else{
            setEstadoAc(v)
            setAcreditacion({...acreditacion, 'estado': v.id});
        }
    };

    /**
     * Case 2:
     */
    /*Estructuras*/
    let [personasDisponibles,setPersonasDisponibles] = useState([]);
    const [roles,setRoles] = useState([]);
    let [personasSeleccionadas,setPersonasSeleccionadas] = useState([]);
    const [rol,setRol] = useState(null);
    const [pSelDisp,setPSelDisp] = useState(null)

    /*Headers*/
    const columnasPDisp = [
        {field: 'id', headerName: 'Codigo', width: 65},
        {field: 'PNombre', headerName: 'Nombre', width: 70,},
        {field: 'PApellido', headerName: 'Apellido', width: 70},
        {field: 'PNumeroDocumento', headerName: 'Documento', width: 115},
        {field: 'PSexo', headerName: 'Sexo', width: 105},
        {field: 'PMail', headerName: 'Mail', width: 70},
        {field: 'PNumeroTelefono', headerName: 'Telefono', width: 70}
    ]
    const columnasPSel = [
        {field: 'id', headerName: 'Codigo', width: 65},
        {field: 'PNombre', headerName: 'Nombre', width: 70,},
        {field: 'PApellido', headerName: 'Apellido', width: 70},
        {field: 'PNumeroDocumento', headerName: 'Documento', width: 115},
        {field: 'PSexo', headerName: 'Sexo', width: 105},
        {field: 'PMail', headerName: 'Mail', width: 70},
        {field: 'PNumeroTelefono', headerName: 'Telefono', width: 70},
        {field: 'PRol', headerName: 'Rol', width: 70}
    ]

    /*Loaders*/
    async function loadPersonas(){
        const response = await fetch('http://localhost:4000/personas')
        const data = await response.json()
        setPersonasDisponibles(data)
    }
    async function loadRoles(){
        const response = await fetch('http://localhost:4000/roles')
        const data = await response.json()
        var newList =[]
        for( var i=0; i<data.length;i++){
            var obj = {label: data[i].rol, id: data[i].id}
            newList.push(obj)
        }
        setRoles(newList)
    }
    function loadPersonasSel(v){
        /*Agregar Seleccionado*/
        var newList = []
        for( var i=0; i<personasSeleccionadas.length;i++){
            var obj = {
                id: personasSeleccionadas[i].id,
                PNombre: personasSeleccionadas[i].PNombre,
                PApellido: personasSeleccionadas[i].PApellido,
                PNumeroDocumento: personasSeleccionadas[i].PNumeroDocumento,
                PSexo: personasSeleccionadas[i].PSexo,
                PMail: personasSeleccionadas[i].PMail,
                PNumeroTelefono: personasSeleccionadas[i].PNumeroTelefono,
                PRol: personasSeleccionadas[i].PRol,
                PRolID: personasSeleccionadas[i].PRolID
            }
            newList.push(obj)
        }
        newList.push(v)
        setPersonasSeleccionadas(newList)

        /*Vaciar los Disponibles*/
        var newList2 = personasDisponibles;
        for(var k=0;k<newList.length;k++) {
            newList2 = newList2.filter(e => e.id !== newList[k].id)
        }
        setPersonasDisponibles(newList2)
    }

    /*Handlers*/
    const handleRowClick = (e,v) => {
        setPSelDisp(e.row)
    }
    const handleClickFlecha = (e) => {
        var obj = {
            id: pSelDisp.id,
            PNombre: pSelDisp.PNombre,
            PApellido: pSelDisp.PApellido,
            PNumeroDocumento: pSelDisp.PNumeroDocumento,
            PSexo: pSelDisp.PSexo,
            PMail: pSelDisp.PMail,
            PNumeroTelefono: pSelDisp.PNumeroTelefono,
            PRol: rol.label,
            PRolID: rol.id
        }
        console.log(obj)
        loadPersonasSel(obj)
        setRol(null);
        //setPersonasSeleccionadas([pSelDisp])

    }
    const handleChangeRR = (e,v) => {
        if( v === null ){
            setRol(null)
            //BOTON NO DISPONIBLE
        }
        else{
            setRol(v)
            //BOTON DISPONIBLE
        }
    }


    /**
     * Case 3:
     */
    /*Estructuras*/
    const [dateFIIns,setDateFIIns] = React.useState(dayjs);
    const [dateFPIns,setDateFPIns] = React.useState(dayjs);
    const [dateFLIns,setDateFLIns] = React.useState(dayjs);
    const [instancia, setInstancia] = useState({
        fechaInicio: dateFIIns.toString(),
        fechaPresentacion: dateFPIns.toString(),
        fechaLimite: dateFLIns.toString(),
        tipo: "",
        observacion: "",
        estado: "",
        documentos: false,
        idC: null,
    })
    const [instanciasT, setInstanciasT] = useState([])
    const [checkedFIIns, setCheckedFIIns] = React.useState(false);
    const [checkedFPIns, setCheckedFPIns] = React.useState(false);
    const [checkedFLIns, setCheckedFLIns] = React.useState(false);
    const [dateSelectorFIIns, setdateSelectorFIIns] = React.useState(false);
    const [dateSelectorFPIns, setdateSelectorFPIns] = React.useState(false);
    const [dateSelectorFLIns, setdateSelectorFLIns] = React.useState(false);

    //DOCUMENTACION
    //DOCUMENTACION
    //DOCUMENTACION

    /*Loaders*/
    async function loadInstancias(){
        //TRAER LOS TIPOS DE INSTANCIA
        const response = await fetch('http://localhost:4000/tipoInstancia')
        const data = await response.json()
        var newList =[]
        for( var i=0; i<data.length;i++){
            var obj = {label: data[i].TITipo, id: data[i].id}
            newList.push(obj)
        }
        setInstanciasT(newList)
        console.log(newList)
    }

    /*Handlers*/
    const handleChangeIns = e =>{
        setInstancia({
            ...instancia, [e.target.name]: e.target.value
        });
    }
    const handleChangeTIns = {}


    //Checkboxs
    const handleChangeCheckboxFIIns = e => {
        setCheckedFIIns(e.target.checked);
        setdateSelectorFIIns(e.target.checked);
        if(e.target.checked === true){
            setInstancia({...instancia, 'fechaInicio': dateFIIns.toString()});
        }
        else{
            setAcreditacion({...instancia, 'fechaInicio': ''});
        }
    };
    const handleChangeCheckboxFPIns = e => {
        setCheckedFPIns(e.target.checked);
        setdateSelectorFPIns(e.target.checked);
        if(e.target.checked === true){
            setInstancia({...instancia, 'fechaPresentacion': dateFPIns.toString()});
        }
        else{
            setInstancia({...instancia, 'fechaPresentacion': ''});
        }
    };
    const handleChangeCheckboxFLIns = e => {
        setCheckedFLIns(e.target.checked);
        setdateSelectorFLIns(e.target.checked);
        if(e.target.checked === true){
            setInstancia({...instancia, 'fechaLimite': dateFLIns.toString()});
        }
        else{
            setInstancia({...instancia, 'fechaLimite': ''});
        }
    };

    //DatePicker
    const handleChangeFIIns = e => {
        setDateFIIns(e);
        setInstancia({...instancia, 'fechaInicio': (e).format('DD/MM/YYYY')});
    };
    const handleChangeFPIns = e => {
        setDateFPIns(e);
        setInstancia({...instancia, 'fechaPresentacion': (e).format('DD/MM/YYYY')});
    };
    const handleChangeFLIns = e => {
        setDateFLIns(e);
        setInstancia({...instancia, 'fechaLimite': (e).format('DD/MM/YYYY')});
    };



    /*Agregar documentacion*/
    const onDrop = useCallback((acceptedFiles) => {
        setSelectedFiles(acceptedFiles.map(file=>
        Object.assign(file,{preview:URL.createObjectURL(file)})))
        /*acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                console.log('leido')
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                console.log(binaryStr)
            }
            reader.readAsArrayBuffer(file)
        })*/
    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})
    const [selectedFiles,setSelectedFiles] = useState([])
    const selected_Files = selectedFiles?.map(file => (
        <div>
            <iframe src={file.preview} alt="" />
            {/*<input type="file" src={file.preview} alt="" /> este me pone el chose file*/}
        </div>
    ))

    const handleBorrarFiles = e => {
        setSelectedFiles([])
    }

    //FILEMANAGER

    const [filePrueba,setFilePrueba] = useState([])
    const pruebaChange = e => {
        setFilePrueba(e.target.files)
    }
    const pruebaChange2 = () => {
        const formData = new FormData();
        formData.append(
            'myFile',
            filePrueba,
        );
        console.log(filePrueba)

        axios.post("http://localhost:4000/api/uploadfile",formData,
            {headers: {"content-type": "multipart/form-data",}});
    }
    /**
     * Form
     */

    useEffect(() => {
        loadFacultades()
        loadCarreras(fac)
        loadPersonas()
        loadRoles()
        loadInstancias()
    }, [])

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        console.log('Se daran de alta los siguientes datos:')
        console.log(acreditacion);
        console.log(instancia);
        console.log(selectedFiles)

        /**
         * Aca de ultima re-hacer el acreditacion e instancia, para que correspondan los datos con la query
         */

            const formData = new FormData();
            formData.append("myFile", selectedFiles);

            console.log(selectedFiles);
            axios.post("http://localhost:4000/api/uploadfile", formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            }); //I need to change this line


        /**
         * reorder json p/ que entren bien los datos
         */

        /*const res = await fetch('http://localhost:4000/altaAcreditacion', {
            method: 'POST',
            body: JSON.stringify(acreditacion),
            headers: {'Content-Type': 'application/json'},
        })
        const dataAc = await res.json();
        console.log(dataAc);*/

        /*const res = await fetch('http://localhost:4000/altaInstancia', {
            method: 'POST',
            body: JSON.stringify(instancia),
            headers: {'Content-Type': 'application/json'},
        })
        const dataIn = await res.json();
        console.log(dataIn);*/


        /*axios.post('http://localhost:4000/upload', formData,{headers:{
                "content-Type": "multipart/form-data",
            }

        })*/

        /**
         * De este data creo que puedo sacar el id del default con el que vuelve xd
         */

        //navigate('/') Para vovler al inicio, ponerle que vaya a listar acreds
    };


    /**
     * Swap Step
     */



     function getStepContent(step) {
        switch (step) {
            case 0:
                /**
                 * Seleccion de Facultad y Carrera
                 */
                return (
                    <React.Fragment>
                        <Typography variant="h6" gutterBottom>
                            Seleccion de Carrera
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
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
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="idC"
                                    name="idC"
                                    options={carreras}
                                    disabled={!fac}
                                    value={car}
                                    sx={{width:450, p: 1}}
                                    onChange={handleChangeCC}
                                    fullWidth
                                    //onMouseLeave={actualizarCC}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Carrera"/>}
                                />

                            </Grid>

                        </Grid>
                    </React.Fragment>
                );
            case 1:
                /**
                 * Ingreso de datos del formulario de Acreditacion
                 */
                return (
                    <React.Fragment>
                        <Typography variant="h6" gutterBottom>
                            Shipping address
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    value={acreditacion.numeroExpediente}
                                    variant='filled'
                                    id='numeroExpediente'
                                    name='numeroExpediente'
                                    label='Numero de Expediente'
                                    fullWidth
                                    onChange={handleChangeAc}
                                    inputProps={{style: {color: 'black'}}}
                                    InputLabelProps={{style: {color: 'black'}}}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    value={acreditacion.convocatoria}
                                    variant='filled'
                                    id='convocatoria'
                                    name='convocatoria'
                                    label='Convocatoria'
                                    multiline
                                    rows={3}
                                    fullWidth
                                    onChange={handleChangeAc}
                                    inputProps={{style: {color: 'black'}}}
                                    InputLabelProps={{style: {color: 'black'}}}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}></Grid>
                            <Grid item xs={12} sm={6}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<CheckBox
                                            checked={checkedFF}
                                            onChange={handleChangeCheckboxFechaFin}
                                        />}
                                        label='Incluir Fecha de Fin'
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        disableFuture
                                        variant='filled'
                                        id='fechaInicio'
                                        name='fechaInicio'
                                        label="Fecha de Inicio"
                                        inputFormat="DD/MM/YYYY"
                                        value={dateFI}
                                        sx={{width:300, p: 1, display: 'block'}}
                                        onChange={handleChangeFechaInicio}
                                        inputProps={{style: {color: 'black'}}}
                                        InputLabelProps={{style: {color: 'black'}}}
                                        renderInput={(params) => <TextField
                                            required
                                            {...params}
                                            sx={{width:200, p: 1}}
                                        />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        disabled={!dateSelectorFF}
                                        variant='filled'
                                        id='fechaFin'
                                        name='fechaFin'
                                        label="Fecha de Fin"
                                        inputFormat="DD/MM/YYYY"
                                        value={dateFF}
                                        sx={{width:200, m: 1, display: 'block'}}
                                        onChange={handleChangeFechaFin}
                                        inputProps={{style: {color: 'black'}}}
                                        InputLabelProps={{style: {color: 'black'}}}
                                        renderInput={(params) => <TextField
                                            {...params}
                                            sx={{width:200, p: 1}}/>}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="tipo"
                                    options={tipo}
                                    value={tipoAc}
                                    sx={{width:200, p: 1}}
                                    onChange={handleChangeAcTi}
                                    renderInput={(params) =>
                                        <TextField
                                            required
                                            {...params}
                                            label="Tipo"/>}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="estado"
                                    options={estado}
                                    value={estadoAc}
                                    sx={{width:200, p: 1}}
                                    onChange={handleChangeAcEs}
                                    renderInput={(params) =>
                                        <TextField
                                            required
                                            {...params}
                                            label="Estado"/>}
                                />
                            </Grid>
                        </Grid>
                    </React.Fragment>
                );
            case 2:
                /**
                 * Seleccion de Personas
                 */
                return (
                    <React.Fragment>
                        <Typography variant="h6" gutterBottom>
                            Seleccion de Personas
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <div style={{height: '100%' }}>
                                    <DataGrid
                                        disableMultipleSelection={true}
                                        style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                        autoHeight
                                        rows={personasDisponibles}
                                        columns={columnasPDisp}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        minHeight={750}
                                        onRowClick={handleRowClick}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end">
                                <Button
                                    disabled={!rol}
                                    variant="contained"
                                    onClick={handleClickFlecha}
                                >
                                    Flecha/add
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    disablePortal
                                    id="idRol"
                                    name="idRol"
                                    options={roles}
                                    value={rol}
                                    sx={{width:200, p: 1}}
                                    onChange={handleChangeRR}
                                    renderInput={(params) =>
                                        <TextField
                                            required
                                            {...params}
                                            label="Rol"/>}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <>
                                    <div style={{height: '100%' }}>
                                        <DataGrid
                                            disableMultipleSelection={true}
                                            style={{backgroundColor: '#8ab8ac', color: 'black'}}
                                            autoHeight
                                            rows={personasSeleccionadas}
                                            columns={columnasPSel}
                                            pageSize={5}
                                            rowsPerPageOptions={[5]}
                                            minHeight={750}
                                        />
                                    </div>
                                </>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                );
            case 3:
                /**
                 * Alta de Instancia *Opcional*
                 */
                return (
                    <React.Fragment>
                        <Typography variant="h6" gutterBottom>
                            Seleccion de Instancia
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    //disable Hacer disable una vez que muestre y recupere bien

                                    disablePortal
                                    id="idTIns"
                                    name="idTIns"
                                    options={instanciasT}
                                    value={instancia.tipo}
                                    sx={{width:200, p: 1}}
                                    onChange={handleChangeTIns}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Tipo de Instancia"/>}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={instancia.observacion}
                                    variant='filled'
                                    id='observacion'
                                    name='observacion'
                                    label='observacion'
                                    multiline
                                    rows={3}
                                    fullWidth
                                    onChange={handleChangeIns}
                                    inputProps={{style: {color: 'black'}}}
                                    InputLabelProps={{style: {color: 'black'}}}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<CheckBox
                                            checked={checkedFIIns}
                                            onChange={handleChangeCheckboxFIIns}
                                        />}
                                        label='Incluir Fecha de Inicio'
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        disabled={!dateSelectorFIIns}
                                        disableFuture
                                        variant='filled'
                                        id='fechaInicioIns'
                                        name='fechaInicioIns'
                                        label="Fecha de Inicio"
                                        inputFormat="DD/MM/YYYY"
                                        value={dateFIIns}
                                        sx={{width:300, p: 1, display: 'block'}}
                                        onChange={handleChangeFIIns}
                                        inputProps={{style: {color: 'black'}}}
                                        InputLabelProps={{style: {color: 'black'}}}
                                        renderInput={(params) => <TextField
                                            {...params}
                                            sx={{width:200, p: 1}}
                                        />}
                                    />
                                </LocalizationProvider>
                            </Grid>


                            <Grid item xs={12} sm={6}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<CheckBox
                                            checked={checkedFPIns}
                                            onChange={handleChangeCheckboxFPIns}
                                        />}
                                        label='Incluir Fecha de Presentacion'
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        disabled={!dateSelectorFPIns}
                                        variant='filled'
                                        id='fechaPresentacionIns'
                                        name='fechaPresentacionIns'
                                        label="Fecha de Presentacion"
                                        inputFormat="DD/MM/YYYY"
                                        value={dateFPIns}
                                        sx={{width:300, p: 1, display: 'block'}}
                                        onChange={handleChangeFPIns}
                                        inputProps={{style: {color: 'black'}}}
                                        InputLabelProps={{style: {color: 'black'}}}
                                        renderInput={(params) => <TextField
                                            {...params}
                                            sx={{width:200, p: 1}}
                                        />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<CheckBox
                                            checked={checkedFLIns}
                                            onChange={handleChangeCheckboxFLIns}
                                        />}
                                        label='Incluir Fecha Limite'
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        disabled={!dateSelectorFLIns}
                                        variant='filled'
                                        id='fechaLimiteIns'
                                        name='fechaLimiteIns'
                                        label="Fecha Limite"
                                        inputFormat="DD/MM/YYYY"
                                        value={dateFLIns}
                                        sx={{width:300, p: 1, display: 'block'}}
                                        onChange={handleChangeFLIns}
                                        inputProps={{style: {color: 'black'}}}
                                        InputLabelProps={{style: {color: 'black'}}}
                                        renderInput={(params) => <TextField
                                            {...params}
                                            sx={{width:200, p: 1}}
                                        />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained" component="label"
                                >
                                    Revisar los valores del boton (UPLOAD)
                                    <input hidden onChange={pruebaChange} accept="image/*" type="file" />
                                </Button>
                                <Button onClick={pruebaChange2}
                                    variant="contained" component="label"
                                >
                                    Prueba2

                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}></Grid>
                            <Grid item xs={12} sm={6}>
                                <div>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                    </div>
                                    {selected_Files}
                                </div>

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained" component="label"
                                    onClick={handleBorrarFiles}
                                >
                                    Cancelar archivos
                                </Button>
                            </Grid>

                        </Grid>
                    </React.Fragment>
                );
            default:
                throw new Error('Unknown step');
        }
    }



    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md" sx={{ mb: 4 }} style={{backgroundColor: 'lightblue'}}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={{backgroundColor: '#7dcfb6'}}>
                    <Typography component="h1" variant="h4" align="center">
                        Alta Acreditacion
                    </Typography>
                    <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <React.Fragment>

                            <Typography>Va a dar de alta los siguientes items:</Typography>
                            <Typography>O confirmar alta:</Typography>
                            <Typography>Ver si los muestro, dejar para despues sino:</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Button>CANCELAR, lleva a inicio</Button>

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <form onSubmit={handleSubmit}>
                                        <Button
                                            variant= 'contained'
                                            color= 'primary'
                                            type='submit'
                                            sx={{p: 1}}
                                            style={{backgroundColor: 'green', color: 'white'}}
                                        >
                                            Confirmar
                                        </Button>
                                    </form>
                                </Grid>
                            </Grid>

                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {getStepContent(activeStep)}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                        Back
                                    </Button>
                                )}

                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 3, ml: 1 }}
                                    disabled={
                                        (activeStep === 0 && (!acreditacion.idC))
                                        ||
                                        (activeStep === 1 && (!acreditacion.convocatoria || !acreditacion.tipo || !acreditacion.estado))

                                    }
                                    //disabled={!acreditacion.convocatoria || !acreditacion.numeroExpediente}
                                >
                                    {activeStep === steps.length - 1 ? 'Agregar' : 'Siguiente'}
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}
                </Paper>
            </Container>
        </ThemeProvider>
    );
}