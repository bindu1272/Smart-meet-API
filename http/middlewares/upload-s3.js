const ForbiddenError = require('../../errors/ForbiddenError');
const UnauthorizedError = require('../../errors/UnauthorizedError');
const aws = require('../../utilities/AWS/AwsService');

module.exports = (fileField) => {
    var key = 'file';
    if (fileField)
        key = fileField;

    return async (req, res, next) => {
        var obj = new aws(req);
        var upload = await obj.uplaodFileToBuffer();
    const singleUpload = upload.single(key);
      
        singleUpload(req, res, function (err, some) {
                
            if (err) {
                console.log(err);
                throw new ForbiddenError();

            } else {
                next();

            }

        });

    };

};