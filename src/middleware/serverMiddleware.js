
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