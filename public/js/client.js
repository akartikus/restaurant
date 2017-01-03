var socket = io();

socket.on('newSocket', function (string) {
    //Actualisation dynamique des données 
    var _date = plandate.value;
    socket.emit('dateChoisie', _date);
});

logout.addEventListener('click', function () {
    window.location.href = '/logout';
}, false);

//Listener afficher disponibilité table
planafficher.addEventListener('click', function(e){    
    e.preventDefault();
    var _date = plandate.value;
    socket.emit('dateChoisie', _date);   
},false);

//Affichge des eregistrement
socket.on('reservationsHeureUser', function (_plan,_date) {    
    table1.innerHTML = ''; 
    table2.innerHTML = '';  
    table3.innerHTML = '';  
    table4.innerHTML = '';    
    var tr;
    var i = 0;
    for (var i = 0, length = _plan.length; i !== length; i++) { 
        var long = _plan[i].length;   
        var reservation = _plan[i].split(",");    
        //alert('Date des reservation ' + reservation[2]);  
        if(_date == reservation[3]){               addTable1
            tr = document.createElement('tr');      
            tr.innerHTML = '<td>' + reservation[0] + ' à '+reservation[1] +'</td>';
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
        socket.emit('createPlanUser', reservationclient1.value,
                                            "1",
                                            planheure1.value,
                                            plandate.value);
        reservationclient1.value = '';
}, false);

addTable2.addEventListener('click', function (e) {    
        e.preventDefault();id="plandate"
        socket.emit('createPlanUser', reservationclient2.value,
                                            "2",
                                            planheure2.value,
                                            plandate.value);
        reservationclient2.value = '';    
}, false);

addTable3.addEventListener('click', function (e) {    
        e.preventDefault();
        socket.emit('createPlanUser', reservationclient3.value,
                                            "3",
                                            planheure3.value,
                                            plandate.value);
        reservationclient3.value = '';    
}, false);

addTable4.addEventListener('click', function (e) {    
        e.preventDefault();
        socket.emit('createPlanUser', reservationclient4.value,
                                            "4",
                                            planheure4.value,
                                            plandate.value);
        reservationclient4.value = '';    
}, false);