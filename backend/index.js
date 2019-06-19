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
  db.run("CREATE TABLE IF NOT EXISTS users (name TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, date NUMERIC NOT NULL, mac TEXT UNIQUE NOT NULL, bio TEXT, isactive NUMERIC, temp_min NUMERIC, temp_max NUMERIC, freq_min NUMERIC, freq_max NUMERIC)");

  var datasql = [];
  userDicionary = {};
  db.each("SELECT *, ROWID as id FROM users", function(err, row) {
    datasql.push(row);
    userDicionary[row.mac] = row;
  }, function () {
    console.log(userDicionary);
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
    db.each("SELECT *, ROWID as id FROM users", function(err, row) {
      datasql.push(row);
      userDicionary[row.mac.toString()] = row;
    }, function () {
      res.json({'users': datasql}).status(200);
      console.log(userDicionary);
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
	console.log('public/' + req.params.id);
	var file = path.join(__dirname, 'public/' + req.params.id);
	var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', 'image/png');
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});




app.post('/newUser', function(req, res) {
	var data = req.body.user;
  data.isactive = true;
  data.temp_min = 30;
  data.temp_max = 40;
  data.freq_max = 200;
  data.freq_min = 30;

  var params =[ data.name, data.email, data.date, data.mac, data.bio, data.isactive,
                data.temp_min, data.temp_max, data.freq_min, data.freq_max];
	var sql ='INSERT INTO users (name, email, date, mac, bio, isactive, temp_min, temp_max, freq_min, freq_max) VALUES (?,?,?,?,?,?,?,?,?,?)';
  db.run(sql, params, function (err, result) {
    if (err){
      console.log(err)
      res.status(400).json({"error": err.message})
      return;
    }
    console.log(data);
    res.json({
      "message": "success",
      "data": data,
      "id" : this.lastID
    })
  });
});




app.post('/updateUser', function(req, res) {
  var data = req.body.user;
  // var params =[ data.name, data.email, data.date, data.mac, data.bio, data.isactive,
  //               data.temp_min, data.temp_max, data.freq_min, data.freq_max];
  var params =[data.temp_min, data.temp_max, data.freq_min, data.freq_max, data.name];
  var sql = 'UPDATE users SET temp_min = ?, temp_max = ?, freq_min = ?, freq_max = ? WHERE name = ?;';
  db.run(sql, params, function (err, result) {
    if (err){
      console.log(err)
      res.status(400).json({"error": err.message})
      return;
    }
    console.log(data);
    res.json({
      "message": "success"
    })
  });
  db.serialize(() => {
    db.each("SELECT *, ROWID as id FROM users", function(err, row) {
      userDicionary[row.mac.toString()] = row;
    });
  });
});




app.post('/alertUser', function(req, res) {
  var message = req.body.message;
  var cmd = message.mac + ';' + message.cmd;
  mqttClient.publish('runner/cmd', cmd);
  res.json({
    "message": "success"
  })
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
    if (topic[1] === 'info') {
      if (topic[2]) {
        io.emit('user', topic[2] + ':' + message.toString());
        console.log(topic[2] + ':' + message.toString())

        var stats = message.toString().split(':');

        if (stats[2] > userDicionary[topic[2]].freq_max || stats[2] < userDicionary[topic[2]].freq_min) {
          mqttClient.publish('runner/cmd', topic[2] + ';F')
        }
        if (stats[0] > userDicionary[topic[2]].temp_max || stats[0] < userDicionary[topic[2]].temp_min) {
          mqttClient.publish('runner/cmd', topic[2] + ';T')
        }
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

