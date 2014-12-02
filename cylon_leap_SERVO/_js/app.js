var socket, socketid;

function init(){

	socket = io("http://localhost");
	socket.on("socketid",function(data){
		console.log("data = " + data);
		socketid = data;
	});	

}

init();
