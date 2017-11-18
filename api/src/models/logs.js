const mongoose		= require('mongoose');
const Schema		= mongoose.Schema;
const moment		= require('moment');

const LogsSchema = new Schema({
	ip: {
		type: String,
		required: false
	},
	data: {
		type: Object,
		required: false
	},
	created_at: {
		type: Date,
		required: false,
		default: moment().format()
	}
});

module.exports = mongoose.model('Logs', LogsSchema);
