var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var mqtt = require('mqtt');
var mqttClient  = mqtt.connect();
const app = express();
var server = null;

var lastMessages = ['', '', '', '', '', '', '', '', '', ''];
var userDicionary = {};

// var routes = require('./src/routes')(app);

const PORT = 3000;

let db = new sqlite3.Database('./db/teste.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (name TEXT UNIQUE, date NUMERIC, mac TEXT UNIQUE, bio TEXT, isactive NUMERIC)");

  var datasql = [];
  db.each("SELECT rowid AS id, name, mac FROM users", function(err, row) {
    // console.log(row.id + ": " + row.name);
    datasql.push(row);
  }, function () {
    console.log(datasql);
  });
});

// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors());

server = app.listen( PORT, function() {
	console.log('Listening on port ' + PORT);
});

const io = require('socket.io')(server);
io.on('connection', function(socket) {
  console.log('Socket connection: ' + socket.id);
});

app.get('/getUsers', function(req, res) {
  db.serialize(() => {
    var datasql = [];
    userDicionary = {};
    db.each("SELECT rowid AS id, name, mac FROM users", function(err, row) {
      datasql.push(row);
      userDicionary[row.mac] = row.id;
    }, function () {
      res.json({'users': datasql}).status(200);
      // console.log(userDicionary);
    });
  });
});

app.get('/getUser/:id', function(req, res) {
  db.serialize(() => {
    var datasql = [];
    db.each("SELECT * FROM users WHERE ROWID=" + req.params.id, function(err, row) {
      datasql.push(row);
    }, function () {
      res.json({'user': datasql}).status(200);
      console.log(datasql);
    });
  });
});

app.get('/getImage/:id', function(req, res) {
	console.log('public/' + req.params.id + '.jpg');
	var file = path.join(__dirname, 'public/' + req.params.id);
	var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', 'image/jpg');
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});

app.post('/newUser', function(req, res) {
  console.log(req.body.user.name);
	var data = {
    name: req.body.user.name,
    mac: req.body.user.mac,
    bio: req.body.user.bio,
    date: req.body.user.date,
    isactive: true
  };
  var params =[data.name, data.date, data.mac, data.bio, data.isactive];
	var sql ='INSERT INTO users (name, date, mac, bio, isactive) VALUES (?,?,?,?,?)';
  db.run(sql, params, function (err, result) {
    if (err){
      res.status(400).json({"error": err.message})
      return;
    }
    res.json({
      "message": "success",
      "data": data,
      "id" : this.lastID
    })
  });
});

app.get('/chat', function(req, res) {
  res.send(lastMessages).status(200);
});

app.post('/chat/postMessage', function(req, res) {
  io.emit('CHAT', req.body.message);
  mqttClient.publish('chat/server', req.body.message);
  res.end('received');
  lastMessages.push(req.body.message);
  lastMessages.shift();
});

mqttClient.on('connect', function () {
  mqttClient.subscribe('runner/#', function (err) {
    if (!err) {
      mqttClient.publish('runner/sensor', 'Hello mqtt')
    }
  });
  mqttClient.subscribe('chat/#', function (err) {
    if (!err) {
      mqttClient.publish('chat/server', 'SERVER ON')
    }
  })
});

mqttClient.on('message', function (topic, message) {
  // message is Buffer
  var topic = topic.toString().split('/');

  if (topic[0] === 'runner') {
    if (topic[1] === 'temp') {
      if (topic[2]) {
        io.emit('TEMP', topic[2] + ':' + message.toString());
        console.log(userDicionary[topic[2]] + ':' + message.toString())
      }
    }
  }

  if (topic[0] === 'chat') {
    if (topic[1] !== 'server') {
      console.log(topic.toString() + ': ' + message.toString())
      io.emit('CHAT', message.toString());
      mqttClient.publish('chat/server', message.toString())
      lastMessages.push(message.toString());
      lastMessages.shift();
    }
  }
  // client.end()
});

