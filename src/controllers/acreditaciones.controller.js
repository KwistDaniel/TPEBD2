const pool = require('../db');


const getAcreditaciones = async(req,res,next) => {
    try{
        const result = await pool.query('SELECT * FROM "Acreditacion" WHERE status = TRUE ORDER BY "AFechaInicio" ASC');
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const getAcreditacionesPorFacultad = async(req,res,next) => {
    try{
        const {id} = req.params;
        const result = await pool.query(
            'SELECT\n' +
            '"Acreditacion".id,"Acreditacion"."ANumeroExpediente","Acreditacion"."AConvocatoria","Acreditacion"."AFechaInicio","Acreditacion"."AFechaFin","Acreditacion"."AEstado","Acreditacion"."ATipo","Acreditacion"."AObservacionProceso","Acreditacion"."AObservacionFinalizacion","Acreditacion"."idC","Acreditacion".status\n' +
            'FROM "Acreditacion" \n' +
            'JOIN "Carrera" ON "Carrera".id = "Acreditacion"."idC"\n' +
            'WHERE (("Carrera"."idF" = $1) AND ("Acreditacion".status = TRUE))\n' +
            'ORDER BY "Acreditacion"."AFechaInicio" ASC'
            ,[id]);
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const getAcreditacionesPorCarrera = async(req,res,next) => {
    try{
        const {id} = req.params;
        const result = await pool.query('SELECT * FROM "Acreditacion" WHERE ((status = TRUE) AND ("idC" = $1)) ORDER BY "AFechaInicio" ASC',[id]);
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const getAcreditacionesPorId = async(req,res,next) => {
    try{
        const {id} = req.params;
        const result = await pool.query('SELECT * FROM "Acreditacion" WHERE ((status = TRUE) AND (id = $1))',[id]);
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const postAcreditacion = async (req, res,next) => {
    const {ANumeroExpediente, AConvocatoria, AFechaInicio, AFechaFin, AEstado, ATipo, AObservacionProceso, AObservacionFinalizacion, idC} = req.body
    try{
        const result = await pool.query('INSERT INTO ' +
            '"Acreditacion" ' +
            '(id, "ANumeroExpediente", "AConvocatoria", "AFechaInicio", "AFechaFin", "AEstado", "ATipo", "AObservacionProceso", "AObservacionFinalizacion", "idC", status) ' +
            'VALUES ' +
            '(DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE) ' +
            'RETURNING *',
            [ANumeroExpediente, AConvocatoria, AFechaInicio, AFechaFin, AEstado, ATipo, AObservacionProceso, AObservacionFinalizacion, idC]);
        res.json(result.rows[0])
    }
    catch(error){
        next(error);
    }
}

const putAcreditacion = async (req,res,next) => {
    const {id,ANumeroExpediente, AConvocatoria, AFechaInicio, AFechaFin, AEstado, ATipo, AObservacionProceso, AObservacionFinalizacion,status} = req.body
    try{
        const result = await pool.query('UPDATE "Acreditacion" SET ' +
            '"ANumeroExpediente" = $1, ' +
            '"AConvocatoria" = $2, ' +
            '"AFechaInicio" = $3, ' +
            '"AFechaFin" = $4, ' +
            '"AEstado" = $5, ' +
            '"ATipo" = $6, ' +
            '"AObservacionProceso" = $7, ' +
            '"AObservacionFinalizacion" = $8, ' +
            'status = $9 ' +
            ' WHERE (id = $10) ' +
            'RETURNING *',
            [ANumeroExpediente, AConvocatoria, AFechaInicio, AFechaFin, AEstado, ATipo, AObservacionProceso, AObservacionFinalizacion, status, id]);
        res.json(result.rows[0])
    }
    catch (error){
        next(error);
    }
}

const getInstancias = async(req,res,next) => {
    try{
        const result = await pool.query('SELECT * FROM "Instancia" WHERE status = TRUE');
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const getInstancia = async(req,res,next) => {
    try{
        const {id} = req.params;
        const result = await pool.query('SELECT * FROM "Instancia" WHERE (id = $1)',[id]);
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const putInstancia = async (req,res,next) => {
    const {id,IObservacion, IFechaInicio, IFechaPresentacion, IFechaLimite, idTI, status} = req.body
    try{
        const result = await pool.query('UPDATE "Instancia" SET ' +
            '"IObservacion" = $2, ' +
            '"IFechaInicio" = $3, ' +
            '"IFechaPresentacion" = $4, ' +
            '"IFechaLimite" = $5, ' +
            'status = $6 ' +
            ' WHERE (id = $1) ' +
            'RETURNING *',
            [id,IObservacion, IFechaInicio, IFechaPresentacion, IFechaLimite, status]);
        res.json(result.rows[0])
    }
    catch (error){
        next(error);
    }
}

const getInstanciasPorId = async(req,res,next) => {
    try{
        const {id} = req.params;
        const result = await pool.query('SELECT * FROM "Instancia" WHERE ((status = TRUE) AND ("idA" = $1))',[id]);
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const postInstancia = async (req, res,next) => {
    const {IObservacion, IFechaInicio, IFechaPresentacion, IFechaLimite, idA, idTI} = req.body
    console.log(IObservacion, IFechaInicio, IFechaPresentacion, IFechaLimite, idA, idTI)
    try{
        const result = await pool.query('INSERT INTO ' +
            '"Instancia" ' +
            '(id, "IObservacion", "IFechaInicio", "IFechaPresentacion", "IFechaLimite", "idA", "idTI", status) ' +
            'VALUES ' +
            '(DEFAULT, $1, $2, $3, $4, $5, $6, TRUE) ' +
            'RETURNING *',
            [IObservacion, IFechaInicio, IFechaPresentacion, IFechaLimite, idA, idTI]);
        res.json(result.rows[0])
    }
    catch(error){
        next(error);
    }
}

const getFacultades = async(req,res,next) => {
    try{
        const result = await pool.query('SELECT * FROM "Facultad" WHERE (status = TRUE) ORDER BY id ASC');
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const getFacultad = async(req,res,next) => {
    try{
        const {id} = req.params;
        const result = await pool.query('SELECT * FROM "Facultad" WHERE ((status = TRUE) AND (id = $1))',[id]);
        if(result.rows.length === 0) return res.status(404).json({
            meesage: 'facultad no encontrada',
        });
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const postFacultad = async (req, res,next) => {
    const {FNombre} = req.body
    try{
        const result = await pool.query('INSERT INTO ' +
            '"Facultad" ' +
            '(id, "FNombre", status) ' +
            'VALUES ' +
            '(DEFAULT, $1, TRUE) ' +
            'RETURNING *',
            [FNombre]);
        res.json(result.rows[0])
    }
    catch(error){
        next(error);
    }
}

const getCarreras = async(req,res,next) => {
    try{
        const result = await pool.query('SELECT * FROM "Carreras" WHERE (status = TRUE) ORDER BY id ASC');
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const getCarrera = async(req,res,next) => {
    try{
        const {id} = req.params;
        const result = await pool.query('SELECT * FROM "Carrera" WHERE ((status = TRUE) AND (id = $1))',[id]);
        if(result.rows.length === 0) return res.status(404).json({
            meesage: 'carrera no encontradas',
        });
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const getCarrerasPorFac = async(req,res,next) => {
    try{
        const {id} = req.params;
        const result = await pool.query('SELECT * FROM "Carrera" WHERE ((status = TRUE) AND ("idF" = $1)) ORDER BY id ASC',[id]);
        if(result.rows.length === 0) return res.status(404).json({
            meesage: 'carreras no encontradas',
        });
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const postCarrera = async (req, res,next) => {
    const {CNombre, CTipo, CObservacion, CDepartamento, idF} = req.body
    try{
        const result = await pool.query('INSERT INTO ' +
            '"Carrera" ' +
            '(id, "CNombre", "CTipo", "CObservacion", "CDepartamento", "idF", status) ' +
            'VALUES ' +
            '(DEFAULT, $1, $2, $3, $4, $5, TRUE) ' +
            'RETURNING *',
            [CNombre, CTipo, CObservacion, CDepartamento, idF]);
        res.json(result.rows[0])
    }
    catch(error){
        next(error);
    }
}

const putCarrera = async (req, res,next) => {
    const {id, CTipo, CObservacion, CDepartamento, status} = req.body
    console.log(req.body)
    try{
        const result = await pool.query('UPDATE "Carrera" SET ' +
            '"CTipo" = $2, ' +
            '"CObservacion" = $3, ' +
            '"CDepartamento" = $4, ' +
            'status = $5 ' +
            ' WHERE (id = $1) ' +
            'RETURNING *',
            [id, CTipo, CObservacion, CDepartamento, status]);
        res.json(result.rows[0])
    }
    catch(error){
        next(error);
    }
}

const getPersonas = async(req,res,next) => {
    try{
        const result = await pool.query('SELECT * FROM "Persona" WHERE status = TRUE ORDER BY id ASC');
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const getPersona = async(req,res,next) => {
    const {id} = req.params;
    try{
        const result = await pool.query('SELECT * FROM "Persona" WHERE ((status = TRUE) AND (id = $1))',[id]);
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const postPersonas = async(req,res,next) => {
    const {PNombre, PApellido, PTipoDocumento, PNumeroDocumento, PSexo, PMail, PNumeroTelefono} = req.body
    try{
        const result = await pool.query('INSERT INTO ' +
            '"Persona" ' +
            '(id, "PNombre", "PApellido", "PTipoDocumento", "PNumeroDocumento", "PSexo" , "PMail", "PNumeroTelefono", status) ' +
            'VALUES ' +
            '(DEFAULT, $1, $2, $3, $4, $5, $6, $7, TRUE) ' +
            'RETURNING *',
            [PNombre, PApellido, PTipoDocumento, PNumeroDocumento, PSexo, PMail, PNumeroTelefono]);
        res.json(result.rows[0])
    }
    catch(error){
        next(error);
    }
}

const putPersonas = async (req, res,next) => {
    const {id, PNombre, PApellido, PMail, PNumeroTelefono, status} = req.body
    console.log(req.body)
    try{
        const result = await pool.query('UPDATE "Persona" SET ' +
            '"PNombre" = $2, ' +
            '"PApellido" = $3, ' +
            '"PMail" = $4, ' +
            '"PNumeroTelefono" = $5, ' +
            'status = $6 ' +
            ' WHERE (id = $1) ' +
            'RETURNING *',
            [id, PNombre, PApellido, PMail, PNumeroTelefono, status]);
        res.json(result.rows[0])
    }
    catch(error){
        next(error);
    }
}

const getParticipa = async(req,res,next) => {
    try{
        const result = await pool.query('SELECT * FROM "Participa" WHERE status = TRUE');
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const getParticipaId = async(req,res,next) => {
    console.log(req.params.idp)
    console.log(req.params.ida)
    try{
        const result = await pool.query('SELECT * FROM "Participa" WHERE (("idA" = $2) AND ("idP" = $1))',[req.params.idp, req.params.ida]);
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const getParticipaAc = async(req,res,next) => {
    const {id} = req.params;
    try{
        const result = await pool.query('SELECT * FROM "Participa" WHERE ((status = TRUE) AND ("idA" = $1))',[id]);
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const postParticipa = async (req, res,next) => {
    const {idP, idA, idR} = req.body
    try{
        const result = await pool.query('INSERT INTO ' +
            '"Participa" ' +
            '("idP", "idA", "idR", status) ' +
            'VALUES ' +
            '($1, $2, $3, TRUE) ' +
            'RETURNING *',
            [idP, idA, idR]);
        res.json(result.rows[0])
    }
    catch(error){
        next(error);
    }
}

const putParticipaAct = async (req, res,next) => {
    const {idP, idA, idR, status} = req.body
    console.log(req.body)
    try{
        const result = await pool.query('UPDATE "Participa" SET ' +
            '"idR" = $3, ' +
            'status = $4 ' +
            ' WHERE (("idA" = $2) AND ("idP" = $1)) ' +
            'RETURNING *',
            [idP, idA, idR, status]);
        res.json(result.rows[0])
    }
    catch(error){
        next(error);
    }
}

const getRoles = async(req,res,next) => {
    try{
        const result = await pool.query('SELECT * FROM "TipoParticipa" WHERE status = TRUE ORDER BY id ASC');
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const getRol = async(req,res,next) => {
    const {id} = req.params;
    try{
        const result = await pool.query('SELECT * FROM "TipoParticipa" WHERE ((status = TRUE) AND (id = $1))', [id]);
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const postRoles = async (req, res,next) => {
    const {rol} = req.body
    try{
        const result = await pool.query('INSERT INTO ' +
            '"TipoParticipa" ' +
            '(id, rol, status) ' +
            'VALUES ' +
            '(DEFAULT, $1, TRUE) ' +
            'RETURNING *',
            [rol]);
        res.json(result.rows[0])
    }
    catch(error){
        next(error);
    }
}

const getTipoInstancia = async(req,res,next) => {
    try{
        const result = await pool.query('SELECT * FROM "TipoInstancia" WHERE status = TRUE ORDER BY id ASC');
        return res.json(result.rows);
    }
    catch (error){
        next(error);
    }
}

const postTipoInstancia = async (req, res,next) => {
    const {TITipo} = req.body
    try{
        const result = await pool.query('INSERT INTO ' +
            '"TipoInstancia" ' +
            '(id, "TITipo", status) ' +
            'VALUES ' +
            '(DEFAULT, $1, TRUE) ' +
            'RETURNING *',
            [TITipo]);
        res.json(result.rows[0])
    }
    catch(error){
        next(error);
    }
}

const uploadFiles = (req,res,next) => {

    /*console.log('hola')
    console.log(req.files.file)
    //console.log(req.files.file)
    let uploadFile = req.files.file
    //let uploadFile = 'hola.txt'
    uploadFile.mv('/server/files/' + uploadFile.name);*/



    /*let uploadFile = req.files.file
    console.log(uploadFile)
    const fileName = req.files.file.name
    uploadFile.mv(
        `${__dirname}/public/files/${fileName}`,
        function (err) {
            if (err) {
                return res.status(500).send(err)
            }
            res.json({
                file: `public/${req.files.file.name}`,
            })
        },
    )
    console.log('se subio?')*/
}


module.exports = {
    getAcreditaciones,
    getAcreditacionesPorFacultad,
    getAcreditacionesPorCarrera,
    getAcreditacionesPorId,
    postAcreditacion,
    putAcreditacion,
    getInstancias,
    getInstancia,
    putInstancia,
    getInstanciasPorId,
    postInstancia,
    getFacultades,
    getFacultad,
    postFacultad,
    getCarreras,
    getCarrera,
    getCarrerasPorFac,
    postCarrera,
    putCarrera,
    getPersonas,
    getPersona,
    postPersonas,
    putPersonas,
    getParticipa,
    getParticipaId,
    getParticipaAc,
    postParticipa,
    putParticipaAct,
    getRoles,
    getRol,
    postRoles,
    getTipoInstancia,
    postTipoInstancia,
    uploadFiles
}