import { Router } from 'express';
const router = new Router();
router.get('/', function( req, res , next ) {
	if(req.user){
		next();
	}
	else{
		res.redirect('/login');
	}
});
export default router;