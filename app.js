const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require("mongoose");
const db = require('./config/keys').mongoURI;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const passport = require('passport');
const users = require("./routes/api/users");
const dogs = require("./routes/api/dogs");
const requests = require('./routes/api/requests');
const walks = require('./routes/api/walks');

app.use(passport.initialize());
require('./config/passport')(passport);

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

app.use("/", (req, res) => {
  res.send("Hello World")
})

// Api routes
app.use("/api/users", users);
app.use("/api/dogs", dogs);
app.use("/api/walks", walks);
app.use("/api/requests", requests);
