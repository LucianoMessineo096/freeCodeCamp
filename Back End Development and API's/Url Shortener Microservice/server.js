const express = require('express');
const cors = require('cors');
const shortId = require('shortId');
const validUrl = require('valid-url');
require('dotenv').config();
const mongoose = require('mongoose');
const {saveUrl,findShortUrl} = require('./models/UrlServices.js');
const bodyParser = require('body-parser');


mongoose.set('strictQuery',false);

mongoose.connect(process.env.MONGO_URI,{ useUnifiedTopology: true,useNewUrlParser: true})
.then(()=>{console.log('mongo connected')})
.catch((err)=>{console.log(err)});

const app = express();
const port=3000;

app.use(cors({optionsSuccessStatus:200}),bodyParser.urlencoded({extended: false}),bodyParser.json())

app.get('/',(req,res)=>{

    res.sendFile(__dirname+'/View/index.htm');
})

app.post('/api/shorturl', async (req,res)=>{

    const url = req.body.url;

    validUrl.isWebUri(url)===undefined ? res.json({error:"invalid url"}) : await saveUrl(url,req,res);

})

app.get('/api/shorturl/:short_url?', async (req,res)=>{

    try{

        const urlParam = await findShortUrl(req.params.short_url)

        if(!urlParam){

            res.json({error:"url not found"})

        }else{

            res.redirect(urlParam.long_url);

        }

    }catch(err){

        console.log(err)

        res.json({error:"Server error"})

    }
})


app.listen(port,()=>{console.log('server running at port: '+ port)})


