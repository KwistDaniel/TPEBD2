const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fileupload = require('express-fileupload')

const routes = require('./routes/routes');
/**
 * El backend se corre con:
 * npm run dev
 *
 * El frontend se corre desde /client con:
 * npm start
 *
 *
 * Se ha seguido el siguiente tutorial:
 * www.youtube.com/watch?v=_zGL_MU29zs
 *
 * instalaciones:
 * npm install @mui/material @emotion/react @emotion/styled
 * npm install @mui/material @mui/styled-engine-sc styled-components
 * el IDE me instalo solo el resto de librerias a traves del package.json
 *
 * A dia 06/12/2022 al no obtener respuestas se frena el desarrollo, deberia enviarlo como esta actual para que quede registro de lo trabajado
 * se estaban trabajando sobre modificaciones, por lo que deberia haber confflictos en alta de instancia o el edit de instancia ya que faltaba pasar eso a tipo date, faltan solicitar mas informacion a los profesores, esperando sus actuales respuestas para no empezar a desarrollar cambios que no pueda seguir trabajandolos
 * algunas queries a la db podrian verse afectadas al ser modificada la estructura con los cambios solicitados
 */
const app = express();

app.use(cors()); //p comunicar backs
app.use(morgan('dev'));
app.use(express.json());
app.use(fileupload());

const multer  = require('multer')

// setup multer for file upload
var storage = multer.diskStorage(
    {
        destination: './build',
        filename: function (req, file, cb ) {
            cb( null, file.originalname);
        }
    }
);

const upload = multer({ storage: storage } )

app.use(express.json());
// serving front end build files
app.use(express.static(__dirname + "/../build"));

// route for file upload
app.post("/api/uploadfile", upload.single('myFile'), (req, res, next) => {
    console.log(req.file.originalname + " file successfully uploaded !!");
    res.sendStatus(200);
});

app.use(routes);
app.use((err,req,res,next) => {
    return res.json({
        message: err.message
    })
});//middleware de errores


app.listen(4000)
console.log('Server on port 4000')