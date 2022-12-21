let express = require('express');
require('dotenv').config();
let app = express();
const bodyParser= require('body-parser')

app.use(function middleware(req,res,next){

    let string = req.method + " " + req.path + " - " + req.ip;

    console.log(string);

    next();
})

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*app.get("/",function(req,res){

    res.send("Hello Express");
});*/

app.get("/",function(req,res){

    res.sendFile(__dirname + "/views/index.html");
})

let express_static=express.static(__dirname+"/public");

app.use("/public",express_static);

app.get("/json",(req,res)=>{

    let response = process.env.MESSAGE_STYLE === "uppercase" ? "HELLO JSON" : "Hello json";

    let obj={"message": response};

    res.json(obj);

})

app.get("/now",(req,res,next)=>{

    req.time=new Date().toString();
    next();
},(req,res)=>{

    res.send({time: req.time})
})

app.get("/:word/echo", (req, res) => {
    const { word } = req.params;
    res.json({
        echo: word
    });
});


app.get("/name",(req,res)=>{

    let name = req.query.first+' '+req.query.last
    name= name.toString()

    let obj ={"name": name}

    res.json(obj)


})

app.post("/name", function(req, res) {
    var string = req.body.first + " " + req.body.last;
    res.json({ name: string });
});


 module.exports = app;
