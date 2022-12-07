import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Menu from './components/Menu'
import TaskForm from './components/TaskForm'
import NavBar from './components/Navbar'
import {Container} from '@mui/material'
import AcreditacionesList from "./components/AcreditacionesList";
import AcreditacionAlta from "./components/AcreditacionAlta";
import FacultadesList from "./components/FacultadesList";
import FacultadAlta from "./components/FacultadAlta";
import CarrerasList from "./components/CarrerasList";
import CarreraAlta from "./components/CarreraAlta";
import ParticipantesList from "./components/ParticipantesList";
import ParticipantesEdit from "./components/ParticipantesEdit";
import PersonasList from "./components/PersonasList";
import PersonaAlta from "./components/PersonaAlta";
import PersonaEdit from "./components/PersonaEdit";
import PersonaBorrar from "./components/PersonaBorrar";
import TipInsList from "./components/TipInsList";
import TipInsAlta from "./components/TipInsAlta";
import RolesList from "./components/RolesList";
import RolesAlta from "./components/RolesAlta";
import AcreditacionEdit from "./components/AcreditacionEdit";
import AcreditacionBorrar from "./components/AcreditacionBorrar";
import InstanciaList from "./components/InstanciaList";
import InstanciaEdit from "./components/InstanciaEdit";
import InstanciaBorrar from "./components/InstanciaBorrar";
import InstanciaAlta from "./components/InstanciaAlta";
import CarreraEdit from "./components/CarreraEdit";
import CarreraBorrar from "./components/CarreraBorrar";
import Informes from "./components/Informes";
import TipInsEdit from "./components/TipInsEdit";
import TipInsDelete from "./components/TipInsDelete";

/**
 * Nota al lector
 * Al momento de iniciar con el proyecto, mi conocimiento sobre React era nulo.
 * Se fueron madurando conceptos de a poco, pero no avanzaron mucho.
 * Pueden haber muchas cosas atadas con alambre, que no tienen mucho sentido hacerlas de esa forma o con
 * codigo de mas para lo que resuelven. Fueron parte del proceso de aprendizaje.
 *
 * @author
 */


export default function App(){
  return(
      <BrowserRouter>
          <NavBar />
          <Container>
              <Routes>
                  <Route path='/' element={<Menu />} />
                  <Route path='/acreditaciones' element={<AcreditacionesList  />} />
                  <Route path='/acreditaciones/new' element={<AcreditacionAlta />} />
                  <Route path='/acreditaciones/edit' element={<AcreditacionEdit />} />
                  <Route path='/acreditaciones/delete' element={<AcreditacionBorrar />} />
                  <Route path='/facultades' element={<FacultadesList />} />
                  <Route path='/facultades/new' element={<FacultadAlta />} />
                  <Route path='/carreras' element={<CarrerasList />} />
                  <Route path='/carreras/new' element={<CarreraAlta />} />
                  <Route path='/carreras/edit' element={<CarreraEdit />} />
                  <Route path='/carreras/delete' element={<CarreraBorrar />} />
                  <Route path='/participantes/list' element={<ParticipantesList />} />
                  <Route path='/participantes/edit' element={<ParticipantesEdit />} />
                  <Route path='/personas' element={<PersonasList />} />
                  <Route path='/personas/new' element={<PersonaAlta />} />
                  <Route path='/personas/edit' element={<PersonaEdit />} />
                  <Route path='/personas/delete' element={<PersonaBorrar />} />
                  <Route path='/instancias/edit' element={<InstanciaEdit />} />
                  <Route path='/instancias/delete' element={<InstanciaBorrar />} />
                  <Route path='/instancias/list' element={<InstanciaList />} />
                  <Route path='/instancias/new' element={<InstanciaAlta />} />
                  <Route path='/tipins' element={<TipInsList />} />
                  <Route path='/tipins/new' element={<TipInsAlta />} />
                  <Route path='/tipins/edit' element={<TipInsEdit />} />
                  <Route path='/tipins/delete' element={<TipInsDelete />} />
                  <Route path='/roles' element={<RolesList />} />
                  <Route path='/roles/new' element={<RolesAlta />} />
                  <Route path='/tasks/new' element={<TaskForm />} />
                  <Route path='/informes' element={<Informes />} />
              </Routes>
          </Container>
      </BrowserRouter>
  )
}