const express = require('express');
const cors = require('cors');
const busboy = require('connect-busboy');
const path = require('path');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

const app = express();
const port = 3000;

app.use(cors());

app.get('/',(req,res)=>{

  res.sendFile(__dirname + '/index.html')
})

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  try {
    res.json({
      "name": req.file.originalname,
      "type": req.file.mimetype,
      "size": req.file.size
    });
  } catch (err) {
    res.send(400);
  }
});

app.listen(port,()=>{console.log('server running')})
