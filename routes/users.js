const express = require("express");
const router = express.Router();
const { User } = require("../db");

// console.clear()

class user {
	constructor(username, log) {
		(this.username = username), (this.log = log);
	}
}

class exerciseLog {
	constructor(description, duration, date) {
		(this.description = description),
			(this.duration = duration),
			(this.date = date
				? new Date(date).toDateString()
				: new Date().toDateString());
	}
}

let response;

// Post at /api/users
router.post("/", async (req, res) => {
	try {
		const { username } = req.body;
		console.log("req.body", req.body);

		const prevUser = await User.findOne({ username });
		if (prevUser) {
			response = { username: prevUser.username, _id: prevUser._id };
		} else {
			const newUser = new User(new user(username, []));
			const savedUser = await newUser.save();
			response = { username: savedUser.username, _id: savedUser._id };
		}
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
});

// Get at /api/users
router.get("/", async (req, res) => {
	try {
		response = await User.find({}, { __v: 0, log: 0 });
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
});

// Post at /api/users/:_id/exercises

router.post("/:_id/exercises", async (req, res) => {
	try {
		const user = await User.findById(req.params._id);
		const { description, duration, date } = req.body;
		console.log("req.body", req.body);
		const newExercise = new exerciseLog(description, parseInt(duration), date);
		await User.findByIdAndUpdate(
			req.params._id,
			{ $push: { log: newExercise } },
			{ new: true }
		);
		response = {
			_id: user._id,
			username: user.username,
			description,
			duration,
			date,
		};
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
});

// Get at /api/users/:_id/logs

router.get("/:_id/logs", async (req, res) => {
	try {
		const user = await User.findById(req.params._id);
		response = {
			count: user.log.length,
			log: user.log,
		};
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
});

// Get at /api/users/:_id/logs?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=limit

router.get("/:_id/logs", async (req, res) => {
	try {
		const user = await User.findById(req.params._id);
		const { from, to, limit } = req.query;
		console.log("req.query", req.query);
		let log = user.log;
		if (from) {
			log = log.filter((exercise) => {
				return new Date(exercise.date) >= new Date(from);
			});
		}
		if (to) {
			log = log.filter((exercise) => {
				return new Date(exercise.date) <= new Date(to);
			});
		}
		if (limit) {
			log = log.slice(0, limit);
		}
		response = {
			count: log.length,
			log,
		};
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
