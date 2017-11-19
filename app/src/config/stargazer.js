exports.logoName	= "StarGazer";

const ip = "localhost";

if (process.env.NODE_ENV === "development") {
	exports.apiUrl		= "http://79.137.36.192:8080";
	exports.urlApp		= "http://79.137.36.192:3000";
} else {
	exports.apiUrl		= "http://"+ip+":8080"
	exports.urlApp		= "http://"+ip+":5000"
}
