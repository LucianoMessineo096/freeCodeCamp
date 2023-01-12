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


// init project
var app = express();
const port = 3000;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 

app.use(cors({optionsSuccessStatus: 200})); 

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
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

  //Handling data parameters with invalid format

  if(!Date.parse(req.params.date) && !Number(req.params.date))
  {
    return res.send({error: "Invalid Date"});
  }


  //Checking for conditions when date parameter is given in microseconds.

  else if(!(/[-]/.test(req.params.date)) && Number(req.params.date))
  {
    let date = new Date(Number(req.params.date));

    return res.send({
      unix: date.getTime(),
      utc: date.toUTCString()
    });
  } 

  //For handling regular test cases when date parameter is in a valid date format.

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
  
