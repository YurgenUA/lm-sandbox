var grunt = require('grunt');
grunt.loadNpmTasks('grunt-aws-lambda');

grunt.initConfig({ 
    lambda_invoke: {
        default: {
        }
    },
    lambda_deploy: {
        default: {
            arn: 'arn:aws:lambda:us-west-2:162782911101:function:yuri2'
        }
    },
    lambda_package: {
        default: {
        }
    }
});

grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy']);