module.exports = function (app) {

	//####################################################################
	//						Users
	var uploadController = require('../controllers/uploadController');
	//--------------------------------------------------------------------

	app.route('/upload')	.post(uploadController.uploadImage);
};
