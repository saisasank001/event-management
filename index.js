var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')
var mongoose=require("mongoose")
var path=require("path")

const db_url = 'mongodb+srv://admin:admin@cluster0.lujhw.mongodb.net/interview?retryWrites=true&w=majority';
mongoose.connect(db_url, {useNewUrlParser: true },
    (err)=>{
    {
        throw err;
    }
})
var app = express();

app.use(cors())

// accept json as body
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.use('/booking',require('./routes/bookEvents'));

normalizePort = (val) => {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
}

var port = normalizePort(process.env.PORT || '8000');

app.listen(port,()=>{
    console.log('application running'+port)
});