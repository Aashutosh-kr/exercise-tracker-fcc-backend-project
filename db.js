require("dotenv").config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.connect(
	process.env.MONGO_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	console.log("Connected to Mongo Successfully")
);

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
	},
	log: [Object],
});
const User = mongoose.model("User", userSchema);

module.exports = { User };
