const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database Config
const dbConnectString = require("./config/keys").mongoURI;

// Connect to db
mongoose
	.connect(
		dbConnectString,
		{ useNewUrlParser: true }
	)
	.then(() => console.log("MongoDB Connected"))
	.catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello, World!"));

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
