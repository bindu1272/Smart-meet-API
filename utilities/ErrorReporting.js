'use strict'

const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const ErrorStackParser = require('error-stack-parser');
const Mail = require('./mail/Mail');

class ErrorReporting {

    constructor(templateOptions = {}) {
        this.templateOptions = templateOptions;
        this.extraInfo = [];
        this.dontReportErrors = [];
    }

    setError(err) {
        this.errorObj = err;
        this.prepareErrorData();
        return this;
    }

    prepareErrorData() {
        this.errData = ErrorStackParser.parse(this.errorObj);

        this.errData = this.errData.map((obj, key) => {
            let str = `at ${obj.functionName} (${obj.fileName}:${obj.lineNumber}:${obj.columnNumber})`;
            return Object.assign({}, obj, { string: str })
        });
        
        this.errDataObj = {
            error: {
                className: this.errorObj.constructor.name,
                message: this.errorObj.message,
                stack: this.errData,
            },
            extras: {
                infoArr: [
                    // { name: 'URL', value: null },
                    // { name: 'Logged In User', value: null },
                ],
            },
        };
    }

    handle(params = []) {
        this.errDataObj['extras']['infoArr'] = params;

        const template = path.resolve(App.paths.views, "emails/error-reporting/default.ejs");
        ejs.renderFile(template, this.errDataObj, this.templateOptions, (err, str) => {
            // console.log(err, str);
        
            new Mail().sendToDevs({
				subject :`[ERROR] - ${this.errDataObj.error.className}: ${this.errDataObj.error.message}`,
				html: str
            });
            console.log('Mail triggered');
        });
    }

    test(params = []) {
        this.errorObj = new Error('Test Error - ErrorReporting is working like a charm :)');
        this.handle(params);
    }

}

module.exports = ErrorReporting;