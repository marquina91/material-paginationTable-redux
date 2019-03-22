const config = require('../../src/config');
module.exports = {
    'facebookAuth' : {
        'clientID'      : 'yourCLIENTID',
        'clientSecret'  : 'yourCLIENTSECRET',
        'callbackURL'   : config.baseUrl + '/auth/facebook/callback/'
    },
    'googleAuth' : {
        'clientID'      : 'yourCLIENTID',
        'clientSecret'  : 'yourCLIENTSECRET',
        'callbackURL'   : config.baseUrl + '/auth/google/callback/'
    }
};