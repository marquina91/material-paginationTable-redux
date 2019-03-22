const config = require('../../src/config');
const authChecksMiddleware = {
  userCheck: function() {
    return function(req, res, next){
      if(req.user){
        return next();
      }
      else{
        return res.redirect('/login/');
      }
    }
  }
};
export default authChecksMiddleware;