var http = require('http');
var path = require('path');
var express = require('express');
var strftime = require('strftime');
var router = express();
var server = http.createServer(router);
var cors = require('cors');

/*
    FIRST TRY

const app = express();
const port=3000;

function checkDate(date){

    //date are in YYYY-MM-DD format

    const regex= new RegExp("^[0-9]*$");
    var unix;
    var utc;

    if(regex.test(date)){

        unix=date;
        utc = new Date(parseInt(unix))
        utc=utc.toUTCString();

    }else{

        date=date.toString();

        let [year,month,day] = date.includes('-') ? date.split('-') : date.split('/');

        date=year+"/"+month+"/"+(parseInt(day)+1);

        date=new Date(date)
        
        unix = Date.now(date)
        utc = date.toUTCString() 

    }

    
    let result={"unix":parseInt(unix) ,"utc":utc}
    
    return result
    
}

app.get('/api/:date',(req,res)=>{

    let date = req.params.date;
    
    checked = checkDate(date);
    
    res.send(checked)

})

app.listen(port,()=>{console.log('server started at port: '+port)})
*/

//AT THE BOTTOM THE CORRECT CODE


var app = express();
const port = 3000;

app.use(cors({optionsSuccessStatus: 200})); 

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/client/index.htm');
});

app.get('/api', (req,res) =>{
  let date = new Date();
  
  let result = {
    unix: date.getTime(),
    utc: date.toUTCString()
  }

  res.send(result);
});

app.get('/api/:date',(req,res) => {

  if(!Date.parse(req.params.date) && !Number(req.params.date))
  {
    return res.send({error: "Invalid Date"});
  }

  else if(!(/[-]/.test(req.params.date)) && Number(req.params.date))
  {
    let date = new Date(Number(req.params.date));

    return res.send({
      unix: date.getTime(),
      utc: date.toUTCString()
    });
  } 

  let date = new Date(req.params.date);

  let result = {
    unix: date.getTime(),
    utc: date.toUTCString()
  }

  res.status(200).send(result);
});


var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
  
