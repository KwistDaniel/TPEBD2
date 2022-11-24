const {Router} = require('express');
const {postId, getAcreditaciones, getIds, getNowTime, getId, getOtraCosa, putAlgo, deleteAlgo, postAlgo} = require('../controllers/tasks.controller')
const pool = require('../db');

const router = Router();

router.get('/tasks', getNowTime)

router.get('/tasks/ids', getIds)

router.get('/tasks/:id', getId)

router.post('/', postAlgo)

router.delete('/tasks', deleteAlgo)

router.put('/tasks', putAlgo)

router.get('/tasks', getOtraCosa)

module.exports = router;