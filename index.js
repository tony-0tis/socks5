const socks = require('socksv5');
const fs = require('fs');
const path = require('path');
console.log(`To configure server settings add config.json with content:
{
  port: Number, - Port of socks5 server (default 1080)
  debug: Boolean, - Display each request info (default true)
  auth: null || {login: String, password: String} || [{login: String, password: String}] - Auth parameters (Default null)
}
`);
let config = {
	port: 1080,
	debug: true
};
try{
	fs.accessSync(path.join(__dirname, 'config.json'));
	let confFile = fs.readFileSync(path.join(__dirname, 'config.json')).toString();
	try{
		config = JSON.parse(confFile);
	}catch(e){
		console.error(new Date(), 'Bad config file', e);
	}
}catch(e){
	console.error(new Date(), 'Access config file', e);
}

const srv = socks.createServer(function(info, accept, deny) {
	if(config.debug) {
		console.log(new Date(), 'Request', info);
	}
	
	accept();
});
srv.listen(config.port || 1080, function() {
	console.log(new Date(), 'SOCKS server listening on port ', config.port || 1080);
});

if(config.auth){
	srv.useAuth(socks.auth.UserPassword(function(user, password, cb) {
		console.log(new Date(), 'try auth', user, password);
	  
		if(!Array.isArray(config.auth)){
			config.auth = [config.auth];
		}
		
		let isAuth = false;
		for(let auth of config.auth){
			if(auth.login == undefined || auth.login == null || auth.password == undefined || auth.password == null){
				console.error('config.auth have to contain {"login": "", "password": ""}');
			}
			
		  	if(auth.login === user && auth.password === password){
		  		isAuth = true;
		  		break;
		  	}
	  	}
	  	
		cb(isAuth);
	}));
}
else{
	console.warn(new Date(), 'no config.auth');
}
