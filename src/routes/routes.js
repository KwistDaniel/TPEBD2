const {Router} = require('express');
const {getAcreditaciones, getAcreditacionesPorFacultad, getAcreditacionesPorCarrera, getAcreditacionesPorId,
    postAcreditacion, putAcreditacion, getInstancias, getInstancia, putInstancia, getInstanciasPorId,
    postInstancia, getFacultades, getFacultad, postFacultad, getCarreras, getCarrera, getCarrerasPorFac,
    postCarrera, putCarrera, getPersonas, getPersona, postPersonas, putPersonas, getParticipa,
    getParticipaId, getParticipaAc, postParticipa, putParticipaAct, getRoles, getRol, postRoles,
    getTipoInstancia, getTipoInstanciaId, postTipoInstancia, putTipoInstancia,
    uploadFiles} = require('../controllers/acreditaciones.controller')
const pool = require('../db');

const router = Router();

router.get('/acreditaciones', getAcreditaciones)

router.get('/acreditaciones/facultad/:id', getAcreditacionesPorFacultad)

router.get('/acreditaciones/carrera/:id', getAcreditacionesPorCarrera)

router.get('/acreditaciones/:id', getAcreditacionesPorId)

router.post('/acreditaciones', postAcreditacion)

router.put('/acreditaciones', putAcreditacion)

router.get('/instancias', getInstancias)

router.get('/instancia/:id', getInstancia)

router.put('/instancia', putInstancia)

router.get('/instancias/:id', getInstanciasPorId)

router.post('/instancias', postInstancia)

router.get('/facultades', getFacultades)

router.get('/facultad/:id', getFacultad)

router.post('/facultades', postFacultad)

router.get('/carreras', getCarreras)

router.get('/carrera/:id', getCarrera)

router.get('/carreras/:id', getCarrerasPorFac)

router.post('/carreras', postCarrera)

router.put('/carreras', putCarrera)

router.get('/personas', getPersonas)

router.get('/persona/:id', getPersona)

router.post('/personas', postPersonas)

router.put('/personas', putPersonas)

router.get('/participa', getParticipa)

router.get('/participaid/:idp/:ida', getParticipaId)

router.get('/participa/:id', getParticipaAc)

router.post('/participa', postParticipa)

router.put('/participaact', putParticipaAct)

router.get('/roles', getRoles)

router.get('/rol/:id', getRol)

router.post('/roles', postRoles)

router.get('/tipoInstancia', getTipoInstancia)

router.get('/tipoInstancia/:id', getTipoInstanciaId)

router.post('/tipoInstancia', postTipoInstancia)

router.put('/tipoInstancia', putTipoInstancia)

router.post('/upload', uploadFiles)

module.exports = router;