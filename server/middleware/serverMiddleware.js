
const serverMiddleware = {
	checkLang: function(baseUrl) {
		return function(req, res, next){
			const langLocal = /^\/(es|en)/i;
			const matched = req.url.match(langLocal);
			if(!(matched)){
			    res.redirect( baseUrl + "/es" + req.url);
			} else {
				req.lang = matched[1];
			}
			next();
		}
	},

	allowControlOrigin: function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header('Access-Control-Allow-Credentials', true);
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	},
	
	addTrailingSlash: function(baseUrl) {
		return function(req, res, next){

		   if(req.url.substr(-1) !== '/' && req.url.length > 1){
		       res.redirect(baseUrl + req.url + '/');
		   }
		   else{
		       next();
		   }
		}
	}
};

export default serverMiddleware;