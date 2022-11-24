const pool = require('../db');

/**
 * AllIds es retorna de la tabla que tengo nomas
 *
**/
const getNowTime = async(req,res,next) => {
    const nowTime = req.body
    const result = await pool.query('select now()');
    res.json(result.rows[0].now)
}

const getAcreditaciones = (req,res,next) => {

    res.send('get del 1');
}

const getIds = async(req,res,next) => {
    try{
        const ids = await pool.query('SELECT * FROM prueba');
        res.json(ids.rows);
    }
    catch (error){
        next(error);
    }
}

const getId = async(req,res,next) => {
    try{
        const {id} = req.params;
        const result = await pool.query('SELECT id FROM prueba WHERE id = $1', [id]);
        if(result.rows.length === 0) return res.status(404).json({
            meesage: 'id no encontrado',
        });
        return res.json(result.rows[0]);
    }
    catch (error){
        next(error);
    }
}

const postAlgo = (req,res,next) => {
    res.send('post');
}

const postId = async (req, res,next) => {
    const {id} = req.body
    try{
        const result = await pool.query('INSERT INTO prueba values ($1) RETURNING *', [id,]);

        res.json(result.rows[0])
    }
    catch(error){
        next(error);
    }
}

const deleteAlgo = (req,res,next) => {
    res.send('delete');
}

const putAlgo = (req,res,next) => {
    res.send('put');
}

const getOtraCosa = (req,res,next) => {
    res.send('hola mundo xd');
}

const updateAlgo = async (req,res,next) => {
    const {id} = req.params;
    const {tabla1, tabla2} = req.body;
    try{
        const result = await pool.query('UPDATE prueba SET tabla1nomb = $1, tabla2nomb = $2 WHERE id = $3 RETURNING *'[tabla1,tabla2,id]); //RETURNING * me devuelve el ob act
    }
    catch (error){
        next(error);
    }

    //ACA PONER IF res.rows.length === 0 entonces devolver otra cosa que me marque el error xd
    return res.json(result.rows[0]);
    console.log(id, tabla1, tabla2);

}


module.exports = {
    getNowTime,
    getAcreditaciones,
    getIds,
    getId,
    postAlgo,
    postId,
    deleteAlgo,
    putAlgo,
    getOtraCosa,
    updateAlgo
}