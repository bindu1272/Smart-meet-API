const UnauthorizedError = require('../../errors/UnauthorizedError');

module.exports = function(req, res, next) {
    
    let authUser = App.helpers.getAuthUser(req);
   
  
    
    if(authUser.id != App.env.ADMIN_ID && ! authUser.is_active) {
        throw new UnauthorizedError("You can't login to the app, please contact admin.");
    }
    
    next();
}    