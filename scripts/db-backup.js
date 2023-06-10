const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const moment = require('moment');
const { exec, spawn } = require('child_process');
const dotenv = require('dotenv');
dotenv.load({ path: path.resolve(__dirname, '../../.env') });

const tempStoragePath = `storage/dumps`;
const dumpFileName = `dump_${moment().format("YYYY_MM_DD_HH_mm_ss")}.sql`;
const dumpFilePath = `${tempStoragePath}/${dumpFileName}`;

const sqlDumpCommand = exec(`mysqldump -u ${process.env.DB_USERNAME} -p${process.env.DB_PASSWORD} ${process.env.DB_DATABASE} > ${dumpFilePath}`)

sqlDumpCommand.on('exit', (code) => {
    
    if (code !== 0) {
        throw new Error(`mysqldump: Bad exit code (${code})`);
    }
    
    const compressCommand = exec(`gzip -c ${dumpFilePath} > ${dumpFilePath}.gz`);
    compressCommand.on('exit', (code) => {
        console.log(`gzip -c ${dumpFilePath} > ${dumpFileName}.gz`);

        if (code !== 0) {
            throw new Error(`gzip: Bad exit code (${code})`);
        }
        
        pushToS3();
    });

});

const pushToS3 = (sourcePath) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });

    s3.putObject({
        Bucket: `${process.env.AWS_S3_BACKUP_BUCKET}/${moment().format('YYYY-MM-DD')}`,
        Key: `${dumpFileName}.gz`,
        ACL: 'private',
        Body: fs.createReadStream(`${dumpFilePath}.gz`)
    }, function handlePutObject(err, data) {
        // If there was an error, throw it
        if (err) {
            throw err;
            // Otherwise, log success
        } else {
            console.log(`Successfully backed up - ${`${dumpFilePath}.gz`}`);
            removeFile(`${dumpFilePath}`);
            removeFile(`${dumpFilePath}.gz`);
        }
    });
}

const removeFile = (filePath, sync = true) => {
    if (sync) {
        return fs.unlinkSync(path.resolve(filePath));
    }
    return fs.unlink(path.resolve(filePath));
}