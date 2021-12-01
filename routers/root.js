import { Router } from "express"; // importing router controller
// import mongoose and User model from db folder
import { mongoose, User } from "./db/index.js";
// import bcrypt to hash the password of our client
import bcrypt from "bcrypt";
// mongodb database access url string
const db_url = `mongodb+srv://dev:passmein@cluster0.gsr2u.mongodb.net/imgur?retryWrites=true&w=majority`;
// new route controller
const router = Router();
// send the html form for login / signup
router
  .get("/", (request, response) => {
    // send response as json for now
    response.json({
      status: true,
      body: "you'll get html",
    });
  })
  // route controller when a post request is made to "/"
  .post("/", async (request, response) => {
    // extract data from the request body
    const { form, username, password } = request.body;
    // encrypt password before saving it to database
    const hash = await bcrypt.hash(password, 12);
    // establish connection to the database 
    const connection = await mongoose.connect(db_url);
    // find a user with the data provided by our client
    const user = await User.findOne({ username });
    if (!connection) // send error response if database cnnection fails
      response.json({ status: false, message: "database connect error" });
    // confirm the existence of user and the data is from a signup form
    if (user && form === "signup")
      response.json({
        status: false, // ask the user to get a diferrent username 
        message: "choose a different username",
      });
    // confirm that the user doesn't exist and data is from signup form
    if (!user && form === "signup") {
      // save the data provided by the client to database if condition is true
      let newUser = await new User({
        username,
        password: hash,
      }).save();
      console.log(newUser);
      // respond with a success message
      response.json({ status: true, message: "account created" });
    }
    // confirm if the user exist and the data is submitted via a login form
    if (user && form === "login") {
      const valid = await bcrypt.compare(password, user.password);
      // if (valid) response.json({ status: true, message: "logged in" });
      // redirect user to his profile if provided credentials are valid
      if (valid) response.redirect(`/profile/${username}`);
        // respond with error message is password is invalid
      else response.json({ status: false, message: "invalid credentials" });
      // respond with error message if username is invalid
    } else response.json({ status: false, message: "invalid credentials" });
  })
  // route controller to update the user credentials
  .put("/", (request, response) => {
    response.json({
      status: false,
      message: "this feature is under development",
    });
  })
  // route controller to delete the user credentials
  .delete("/", (request, response) => {
    response.json({
      status: false,
      message: "this feature is under development",
    });
  });

export { router as root };
