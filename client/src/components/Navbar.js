import {Button, Typography} from '@mui/material'
import {Box} from '@mui/system'
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import React from "react";
import {Link, useNavigate} from 'react-router-dom'
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export  default function NavBar(){
    const [utilSel,setUtilSel] = React.useState(null)
    const openUtilidades = Boolean(utilSel)
    const navigate = useNavigate()

    const menuClick = (e) => {
        setUtilSel(e.currentTarget);
    }
    const handleCloseUtil = () => {
        setUtilSel(null);
    }


    return(
        <Box sx={{flexGrow: 1, flex: 0, padding: 0}}>
            <AppBar position='static' color='transparent'>
                <Container>
                    <Toolbar>
                        <Typography variant='h6' display='flex' justifyContent='flex-end' >
                            <Link to='/' style={{textDecoration: 'none', color: '#000'}}>
                                <div style={{textAlign: 'center'}}>
                                    Subsecretaría de Acreditación y Desarrollo Institucional
                                </div>
                            </Link>
                        </Typography>
                    </Toolbar>
                    <Toolbar>
                        <Button variant='contained' style={{backgroundColor: '#8ab8ac', color: 'black' ,marginRight: '.5rem',marginLeft: '.5rem'}} onClick={() => navigate('/acreditaciones', {state: {idf: 0, idc: 0}})}>
                            Acreditaciones
                        </Button>
                        <Button variant='contained' style={{backgroundColor: '#8ab8ac', color: 'black' ,marginRight: '.5rem',marginLeft: '.5rem'}} onClick={() => navigate('/informes')}>
                            Informes
                        </Button>
                        <Button
                            variant='contained'
                            style={{backgroundColor: '#8ab8ac', color: 'black', marginRight: '.5rem',marginLeft: '.5rem'}}
                            onClick={menuClick} >
                            Utilidades
                        </Button>
                        <Menu
                            id="menuUtilidades"
                            anchorEl={utilSel}
                            open={openUtilidades}
                            onClose={handleCloseUtil}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button'
                            }}
                        >
                            <MenuItem onClick={function(e){handleCloseUtil(); navigate('/facultades')}}>Facultades</MenuItem>
                            <MenuItem onClick={function(e){handleCloseUtil(); navigate('/carreras', {state: {idf: 0}})}}>Carreras</MenuItem>
                            <MenuItem onClick={function(e){handleCloseUtil(); navigate('/personas')}}>Personas</MenuItem>
                            <MenuItem onClick={function(e){handleCloseUtil(); navigate('/roles')}}>Roles de Participantes</MenuItem>
                            <MenuItem onClick={function(e){handleCloseUtil(); navigate('/tipins')}}>Tipos de Instancias</MenuItem>
                            <MenuItem onClick={function(e){handleCloseUtil(); navigate('/')}}>Inicio</MenuItem>
                        </Menu>

                    </Toolbar>
                </Container>
            </AppBar>
        </Box>

    )
}