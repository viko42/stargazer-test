const kairosApi			= require('../services/kairos');
const async				= require('async');
const _					= require('lodash');
const moment			= require('moment');
const fs				= require('fs');

const mongoose			= require('mongoose');
const Logs				= mongoose.model('Logs');

exports.uploadImage = function(req, res) {
	const	file		= req.body.file;
	const	today		= moment().format("DDMMYYYY") + "/";
	let		base64Data, extension, newLog, result;

	async.waterfall([

		/* Parse the file requested */
		function (callback) {
			if (!file)
				return callback({error: 'no file sent'});

			if (file.match(/^data:image\/png;base64,/)) {
				base64Data = file.replace(/^data:image\/png;base64,/, "");
				extension = "png";
			}
			else if (file.match(/^data:image\/jpeg;base64,/)) {
				base64Data = file.replace(/^data:image\/jpeg;base64,/, "");
				extension = "jpeg";
			}
			else if (file.match(/^data:image\/jpg;base64,/)) {
				base64Data = file.replace(/^data:image\/jpg;base64,/, "");
				extension = "jpg";
			}
			else
				return callback({error: 'invalid file'});
			return callback();
		},

		/* Call our kairosApi */
		function (callback) {
			kairosApi.detectFace(file, function (err, body) {
				if (err)
					return callback(err);

				result = body;
				return callback();
			})
		},

		/* Parse our kairosApi result */
		function (callback) {
			/* Catch error messages from Kairos */
			if (!result || !result.images)
				return callback({error: result.Errors ? result.Errors[0].Message : "Unable to reach Kairos"});

			/* Pictures with other than one face are not allowed */
			if (result.images[0].faces && result.images[0].faces.length !== 1)
				return callback({error: 'Unable to find the correct face. Please put only one face in the picture.'});

			let attributes = result.images[0].faces[0].attributes;

			/* Save GenderType & Age for our Database */
			newLog = { genderType: attributes.gender.type, age: attributes.age };

			result = {
				attributes: [
					{type: 'Asian',	value: attributes.asian, backgroundColor: 'yellow', hoverBackgroundColor: 'yellow'},
					{type: 'Hispanic', value: attributes.hispanic, backgroundColor: 'brown', hoverBackgroundColor: 'brown'},
					{type: 'Black', value: attributes.black, backgroundColor: 'black', hoverBackgroundColor: 'black'},
					{type: 'European', value: attributes.white, backgroundColor: 'purple', hoverBackgroundColor: 'purple'},
					{type: 'Other', value: attributes.other, backgroundColor: 'red', hoverBackgroundColor: 'red'},
				]
			};

			/* Sort our result, [0] << will be >> the race */
			result.attributes = _.orderBy(result.attributes, ['value'], ['desc']);
			return callback();
		},

		/* Log the request */
		function (callback) {
			newLog = new Logs({
				ip: req.connection.remoteAddress,
				data: {
					age: newLog.age,
					race: result.attributes[0].type,
					gender: newLog.genderType
				}
			});

			newLog.save(function (err, saved) {
				if (err)
					return callback({error: 'unable to save'});

				if (!fs.existsSync("uploads/"+today))
				    fs.mkdirSync("uploads/"+today);

				fs.writeFile("uploads/"+today+saved.id+"."+extension, base64Data, 'base64', function(err) {
					return callback();
				});
			});
		},

	], function (err) {
		if (err)
			return res.status(403).json(err);
		return res.status(200).json(result);
	});
};
