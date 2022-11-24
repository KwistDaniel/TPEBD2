const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fileupload = require('express-fileupload')

const routes = require('./routes/routes');
//no uso thunderclient yo para las pruebas
//se runea con npm run dev
//Quede en
/**
 * El backend se corre con:
 * npm run dev
 *
 * El frontend se corre desde /client con:
 * npm start
 *
 * El servidor http-server para archivos se corre con:
 * cd /server npm run build && node ./server
 *
 *
 * Se ha seguido el siguiente tutorial:
 * www.youtube.com/watch?v=_zGL_MU29zs
 * @Quede_en: 2:28:01
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