const passport = require('passport');

import config from '../../src/config';
import { Router } from 'express';

const router = new Router();
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login/');
});
router.get('/facebook', passport.authenticate('facebook', { display: 'popup' }));
router.get('/facebook/callback/', passport.authenticate('facebook',
  { successRedirect: '/', 
    failureRedirect: '/login/' }));
router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] , display: 'popup' }));
router.get('/google/callback/', passport.authenticate('google',
	{ successRedirect : '/' ,
		failureRedirect : '/login/'}));
module.exports = router;