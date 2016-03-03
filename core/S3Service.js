
var AWS = require('aws-sdk');

var S3Service = function () {};

S3Service.prototype.GetFile = function (params, callback) {
    var s3 = new AWS.S3();
    
    s3.getObject(params, function(err, data) {
        if(err) {
            callback(new Error(err));
        } else {
            
            
            callback(null, data.Body, data.ContentType);
        }
    });
};

S3Service.prototype.PutFile = function (bucket, key, body, type, callback) {
    var s3 = new AWS.S3();

    var params = { 
        Bucket: bucket, 
        Key: key, 
        Body: body, 
        ContentType : type 
    };
     
    s3.putObject(params, function(err, res) {

        if(err) {
            console.log('s3.putObject error %j', err);
            callback(new Error(err));
        } else {
            console.log('s3.putObject OK');
            callback(null);
        }
    });
};
    
S3Service.prototype.DeleteFile = function (params, callback) {
    var s3 = new AWS.S3();
    
    s3.deleteObject(params, function(err, res) {
        if(err) {
            callback(new Error(err));
        } else {
            callback(null);
        }
    });
};

module.exports = S3Service;