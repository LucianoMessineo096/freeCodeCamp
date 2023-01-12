const express = require('express');
const cors = require('cors');
const { json } = require('express');

const app= express();
const port=3000;

//-------- Functions

function createRes(req,res){

    var ipaddress;
    var language;
    var software;

    const regex=new RegExp("^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")
    const [empty,empty2,ip,ip2]=req.socket.remoteAddress.split(':');

    if(ip!=null && regex.test(ip)){

        ipaddress=ip.toString();
    }

    if(ip2!=null && regex.test(ip2)){

        ipaddress=ip2;
    }

    language=req.headers["accept-language"]
    software=req.headers["user-agent"]
    
    let obj={

        "ipaddress": ipaddress,
        "language": language,
        "software": software
    }

    obj=JSON.stringify(obj)
    obj=JSON.parse(obj)
    
    return obj;
    
}


//----------

//to enable cors request
app.use(cors({optionsSuccessStatus: 200}));

app.get('/',(req,res)=>{

    res.sendFile(__dirname+'/index.htm');
})

app.get('/api/whoami',(req,res)=>{

    var objRes= createRes(req,res);

    res.status(200).send(objRes)
})

app.listen(port,()=>{console.log('app listening on port: '+port)})
