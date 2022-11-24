const {Router} = require('express');
const {getAcreditaciones, postAcreditacion, putAcreditacion, getFacultades, getCarreras, getCarrera, getPersonas, getRoles} = require('../controllers/acreditaciones.controller')
const pool = require('../db');

const router = Router();

router.get('/acreditaciones', getAcreditaciones)

router.post('/acreditaciones', postAcreditacion)

router.put('/acreditaciones', putAcreditacion)

router.get('/facultades', getFacultades)

router.get('/carreras', getCarreras)

router.get('/carreras/:id', getCarrera)

router.get('/personas', getPersonas)

router.get('/roles', getRoles)

module.exports = router;