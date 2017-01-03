const port       = 'PORT' in process.env ? process.env.PORT : 3030;
const express    = require('express');
const bodyParser = require('body-parser');
const passport   = require('passport');
const bcrypt     = require('bcrypt-nodejs');
const fs         = require('fs');
var app          = express();
var server       = require('http').createServer(app);
var io           = require('socket.io')(server);
var users;
var plan;

app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(require('cookie-session')({ secret: 'secretkey' }));

// Initialisation des arrays
users = JSON.parse(fs.readFileSync('database.json', 'utf8')).users;
plan = JSON.parse(fs.readFileSync('database.json', 'utf8')).plan;
console.log('database: ok');

require('./config/passport.js')(passport, users, bcrypt);
app.use(passport.initialize());
app.use(passport.session());
app.use(require('connect-flash')());
require('./app/routes.js')(app, passport);
server.listen(port);
console.log('listening on port: ' + port);

io.on('connection', function (socket) {
    console.log('Client connected: ' + socket.id);
    
    io.emit('newSocket', 'Your Client ID: ' + socket.id);
    socket.broadcast.emit('newSocket', 'Client connected: ' + socket.id);
    admins.emit('newSocketAdmin', 'Your Admin ID: ' + socket.id);

    socket.on('disconnect', function () {
        console.log('Client disconnected: ' + socket.id);
        socket.broadcast.emit('newSocket', 'Client disconnected: ' + socket.id);
    });

    socket.on('dateChoisie', function (_date) {         
        io.emit('reservationsHeureUser', planAdmin(),_date);
    });

    socket.on('createPlanUser', function (_client, _table, _heure, _date) {
        console.log("Création reservation par l'utilisateur" + _table);
        plan[_client + "," + _heure + "," + _table + "," + _date] = "Table" + _table;
        io.emit('reservationsHeureUser', planAdmin(),_date);
        setDatabase();
        //
        io.emit('newSocket', 'Your Client ID: ' + socket.id);
        socket.broadcast.emit('newSocket', 'Client connected: ' + socket.id);
        admins.emit('newSocketAdmin', 'Your Admin ID: ' + socket.id);

    });

});

var admins = io.of('/admins');

admins.on('connection', function (socket) {
    console.log('Admin connected: ' + socket.id);
    
    socket.emit('newSocketAdmin', 'Your Admin ID: ' + socket.id);
    socket.broadcast.emit('newSocketAdmin', 'Admin connected: ' + socket.id);
    io.emit('newSocket', 'An admin is here');
    
    //Populate list and table
    socket.emit('usersAdmin', staffAdmin());    

    socket.on('disconnect', function () {
        console.log('Admin disconnected: ' + socket.id);
        socket.broadcast.emit('newSocketAdmin', 'Admin disconnected: ' + socket.id);
    });

    // ******* CRUD USERS *******//
    socket.on('createUserAdmin', function (_username, _password) {
        users[_username] = bcrypt.hashSync(_password, bcrypt.genSaltSync(8), null);
        admins.emit('usersAdmin', staffAdmin());
        setDatabase();
    });
    socket.on('deleteUserAdmin', function (_username) {
        delete users[_username];
        admins.emit('usersAdmin', staffAdmin());
        setDatabase();
    });

    socket.on('heureChoisie', function (_date) {    
        admins.emit('reservationsHeureAdmin', planAdmin(),_date);
    });

    // ******** CRUD PLAN ******//
    socket.on('createPlanAdmin', function (_client, _table, _heure, _date) {
        console.log("Création reservation par l'admin" + _table);
        plan[_client + "," + _heure + "," + _table + "," + _date] = "Table" + _table;
        admins.emit('reservationsHeureAdmin', planAdmin(),_date);
        setDatabase();
        //
        socket.emit('newSocketAdmin', 'Your Admin ID: ' + socket.id);
        socket.broadcast.emit('newSocketAdmin', 'Admin connected: ' + socket.id);
        io.emit('newSocket', 'An admin is here');
    });
     socket.on('deletePlanAdmin', function (_num,_date) {
        console.log("Suppression " + _num + " : " + _date);
        delete plan[_num];
        admins.emit('reservationsHeureAdmin', planAdmin(),_date);
        setDatabase();
        //
        socket.emit('newSocketAdmin', 'Your Admin ID: ' + socket.id);
        socket.broadcast.emit('newSocketAdmin', 'Admin connected: ' + socket.id);
        io.emit('newSocket', 'An admin is here');
    });

});

function staffAdmin() {
    let usersList = [];
    for (let username in users)
        usersList.push(username);
    return usersList;
}

function clientAdmin() {
    let clientsList = [];
    for (let clientnum in clients)
        clientsList.push(clientnum);
    return clientsList;
}


function planAdmin() {
    let planList = [];
    for (let planKey in plan)
        planList.push(planKey);
    return planList;
}
function setDatabase() {
    fs.writeFileSync('database.json', JSON.stringify({ users: users, plan: plan}, null, 4), 'utf8');    
}
