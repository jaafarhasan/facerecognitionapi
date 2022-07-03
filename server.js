const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT;
const app = express();
const { db } = require("./services/db");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json("Hello world!");
});

app.post("/signin", signin.handleSignin(db, bcrypt));

app.get("/profile/:id", profile.handleProfileGet(db));

app.post("/register", register.handleRegister(db, bcrypt));

app.put("/image", image.handleImageSubmit(db));
app.post("/imageurl", image.handleApiCall);
app.post("/predictage", image.handlePredictAge);

app.listen(port, () => console.log(`Server is running on ${port}`));

/*
Routes for API:

/ --> if it is signed in -> return home
      if it is not signed in -> return signin
/signin --> Get: return the signin page
            Post: Try to sign the user in -> then redirect to home in success
/register -->   Get: return the register page
                Post: Try to register the user -> then redirect to signin in success
/profile/:uderId -->    Get: return user profile info
/image -->  PUT -> update the user rank (updated the user data (rank))

*/
