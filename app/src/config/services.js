import axios from 'axios';

const {apiUrl} = require('./stargazer');

const tabs = {
	'uploadImage': {
		'method': 'POST',
		'url': apiUrl + '/upload'
	},
}

const services = (props, data, callback) => {

	axios({
		method: tabs[props].method,
		url: tabs[props].url,
		headers: {},
		data: { ...data }
	}).then(function (res) {
		return callback(null, res);
	}).catch(function (err) {
		if (err.response)
			return callback(err.response.data.errors, err.response);
	});
}

export default services;
