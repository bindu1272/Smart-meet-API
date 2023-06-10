require("dotenv").config();
var Env = process.env || {};
const chalk = require('chalk');
const AwareJS = require('awarejs');
const ImportError = require('./ImportError');
const GenericError = require('./GenericError');
const ForbiddenError = require('./ForbiddenError');
const ValidationError = require('./ValidationError');
const UnauthorizedError = require('./UnauthorizedError');
const ModelNotFoundError = require('./ModelNotFoundError');
const InvalidSecretError = require('./InvalidSecretError');

module.exports = function (err, req, res, next) {

    console.log(chalk.red('======================================================'));
    console.log(chalk.bgRed(chalk.white(err)))
    console.log(err);
    console.log(chalk.red('======================================================'));

    switch (err.constructor) {
        case InvalidSecretError:
            return res.error(err, err.status);

        case UnauthorizedError:
            return res.error(err, 401, err.customCode);

        case ValidationError:
           
            if(req.api.version=='v1')
            {
                err.message=err.errors[Object.keys(err.errors)[0]][0];
                return res.error(err, 400, err.customCode);  
            }
          
            return res.error(err, 422, err.customCode);

        case GenericError:
            return res.error(err, err.status, err.customCode);

        case ModelNotFoundError:
            return res.error(err, 400, err.customCode);

        case ImportError:
            return res.error(err, 400, err.customCode);

        case ForbiddenError:
            return res.error(err, 403, err.customCode);

        default:
            triggerErrorReport(req, err);
            
            if (! App.env.APP_DEBUG) {
                return res.error(new Error("Something went wrong, Please try again later!"), 500);
            }
            
            return res.error(err, 500);
    }

}

const initAwareJS = () => {
    awareJsOptions = {
        mailer: {
            credentials: {
                host: Env.MAIL_HOST || null,
                port: Env.MAIL_PORT || null,
                secure: (Env.MAIL_PORT === '465') ? true : false,
                auth: {
                    user: Env.MAIL_USERNAME || null,
                    pass: Env.MAIL_PASSWORD || null,
                }
            },
            config: { // Node mailer message configuration options
                to: Env.DEV_EMAILS,
                from: Env.MAIL_DEFAULT_SENDER_EMAIL || 'devs@freshfinds.in',
            },
        },
        params: {
            footer: {
                unsubscribe: {
                    link: null,
                }
            }
        },
        debug: false, // prints console.log() wherever needed to debug the issue
    };
    
    awareObj = new AwareJS(awareJsOptions);
} 

// Triggers error reports to email
const triggerErrorReport = (req, err) => {
    
    const authUser = App.helpers.getAuthUser(req);
    
    awareObj.setError(err);
    
    awareObj.setMailerConfig({
        
    })
    
    awareObj.trigger([
        {
            name: 'Request URL',
            value: `[${req.method}] ${Env.BASE_URL}${req.originalUrl}`,
        },
        {
            name: 'Auth User',
            value: authUser ? `${authUser.getFullName} (${authUser.id})` : 'Guest',
        },
    ]);
    
}

let awareJsOptions = {};
let awareObj = {};
initAwareJS();