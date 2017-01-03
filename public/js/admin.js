var socketAdmin = io('/admins');

socketAdmin.on('newSocketAdmin', function (string) {
    //Actualisation dynamique des données 
    var _date = plandate.value;
    socketAdmin.emit('heureChoisie', _date);
});

// CRUD utilisateurs
socketAdmin.on('usersAdmin', function (_users) {
    users.innerHTML = '';
    var tr;
    for (var i = 0, length = _users.length; i !== length; i++) {
        tr = document.createElement('tr');
        if (_users[i] === 'Admin')
            tr.innerHTML = '<td>' + _users[i] + '</td><td><button class="btn btn-default"><span class="glyphicon glyphicon-pencil"></span> Editer</button></td>';
        else {
            tr.innerHTML = '<td>' + _users[i] + '</td><td><button class="btn btn-default"><span class="glyphicon glyphicon-pencil"></span> Editer</button> <button class="btn btn-default"> <span class="glyphicon glyphicon-remove"></span> Supprimer</button></td>';
            tr.lastElementChild.lastElementChild.addEventListener('click', (function (_username) {
                return function () {
                    if (confirm('Supprimer l\'utilisateur "' + _username + '" ?'))
                        socketAdmin.emit('deleteUserAdmin', _username);
                };
            })(_users[i]), false);
        }
        tr.lastElementChild.firstElementChild.addEventListener('click', (function (_username) {
            return function () {
                username.value = _username;
            };
        })(_users[i]), false);
        //Ajout à la tbody = "users"
        users.appendChild(tr);
    }
    username.click();
    password.click();
});

//Listener du bouton createuser
createuser.addEventListener('click', function (e) {
    if (username.checkValidity() && password.checkValidity()) {
        e.preventDefault();
        socketAdmin.emit('createUserAdmin', username.value.trim(), password.value);
        username.value = '';
        password.value = '';
    }
}, false);

//Affichge des enregistrements
socketAdmin.on('reservationsHeureAdmin', function (_plan,_date) {    
    table1.innerHTML = ''; 
    table2.innerHTML = '';  
    table3.innerHTML = '';  
    table4.innerHTML = '';    
    var tr;
    var i = 0;
    for (var i = 0, length = _plan.length; i !== length; i++) { 
        var long = _plan[i].length;   
        var reservation = _plan[i].split(",");    
        if(_date == reservation[3]){               
            tr = document.createElement('tr');      
            tr.innerHTML = '<td>' + reservation[0] + ' à '+reservation[1] +'</td>'+
                           '</td><td><button class="btn btn-default"><span class="glyphicon glyphicon-pencil"></span> Editer</button> <button class="btn btn-default"> <span class="glyphicon glyphicon-remove"></span> Supprimer</button></td>';
            tr.lastElementChild.lastElementChild.addEventListener('click', (function (_reservationnum) {
                return function () {
                    if (confirm('Annuler la reservation ' + _reservationnum +  " ?"))
                        socketAdmin.emit('deletePlanAdmin', _reservationnum, _date);
                };
            })(_plan[i]), false);
        
            tr.lastElementChild.firstElementChild.addEventListener('click', (function (_reservationnum) {
                return function () {
                    var reservation = _reservationnum.split(",");  
                    socketAdmin.emit('deletePlanAdmin', _reservationnum, reservation[3]);
                    if(reservation[2]=="1"){
                        reservationclient1.value = reservation[0];
                        planheure1.value = reservation[1];
                    }
                    if(reservation[2]=="2"){
                        reservationclient2.value = reservation[0];
                        planheure2.value = reservation[1];
                    }
                    if(reservation[2]=="3"){
                        reservationclient3.value = reservation[0];
                        planheure3.value = reservation[1];
                    }
                    if(reservation[2]=="4"){
                        reservationclient4.value = reservation[0];
                        planheure4.value = reservation[1];
                    }
                };
            })(_plan[i]), false);
            if(reservation[2]=="1")
                table1.appendChild(tr);
            if(reservation[2]=="2")
                table2.appendChild(tr);
            if(reservation[2]=="3")
                table3.appendChild(tr);
            if(reservation[2]=="4")
                table4.appendChild(tr);
        }
    }
    //reservationnum.click(); 
});

//Listener pour ajouter une reservation par table
addTable1.addEventListener('click', function (e) {    
        e.preventDefault();
        socketAdmin.emit('createPlanAdmin', reservationclient1.value,
                                            "1",
                                            planheure1.value,
                                            plandate.value);
        reservationclient1.value = '';
        
}, false);

addTable2.addEventListener('click', function (e) {    
        e.preventDefault();id="plandate"
        socketAdmin.emit('createPlanAdmin', reservationclient2.value,
                                            "2",
                                            planheure2.value,
                                            plandate.value);
        reservationclient2.value = '';    
}, false);

addTable3.addEventListener('click', function (e) {    
        e.preventDefault();
        socketAdmin.emit('createPlanAdmin', reservationclient3.value,
                                            "3",
                                            planheure3.value,
                                            plandate.value);
        reservationclient3.value = '';    
}, false);

addTable4.addEventListener('click', function (e) {    
        e.preventDefault();
        socketAdmin.emit('createPlanAdmin', reservationclient4.value,
                                            "4",
                                            planheure4.value,
                                            plandate.value);
        reservationclient4.value = '';    
}, false);

//Listener afficher disponibilité
planafficher.addEventListener('click', function(e){    
    e.preventDefault();
    var _date = plandate.value;
    socketAdmin.emit('heureChoisie', _date);
},false);

//Control disponibilité table
function checkDiponibility(_table, _heure, _reservations, _tables){
    var place = _tables[_table];
    var count = 0;
    for (var i = 0, length = _reservations.length; i !== length; i++) {
        if(_reservations[i]["heure"]==_heure){
            count++;
        }
    }
    return place - count;
}

logout.addEventListener('click', function () {
    window.location.href = '/logout';
}, false);
