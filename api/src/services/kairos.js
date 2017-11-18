const request	= require('request');
const moment 	= require('moment');
const stargazer	= require('../config/stargazer');

module.exports  = {
    detectFace: function (base64, callback) {
		request.post({
            url: 'https://api.kairos.com/detect',
            headers : {
                "Content-Type": "application/json",
                "Accept": "application/json",
				"app_id": stargazer.configs.kairos.app_id,
				"app_key": stargazer.configs.kairos.app_key
            },
            json: {
				"selector": "FRONTAL",
				"image": base64
			},
        }, function(err, httpResponse, body){
            if (err)
                return callback(`Error kairos: ${err}`);
            return callback(null, body);
        })
    },
};
