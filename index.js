const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("./db");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

// Routes
app.use("/api/users", require("./routes/users"));

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log("Your app is listening on port " + listener.address().port);
});
