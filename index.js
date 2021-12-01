// configuring enivironment variabes
await import("dotenv").then((dotenv) => dotenv.config());
const { PORT, HOST } = process.env; // getting the environment variables
import express from "express"; // importing express framework
const app = express(); // creating a new express application
import * as routes from "./routers/index.js";
app
  .use(express.urlencoded({ extended: true })) // parsing request body
  .use(express.static("public")) // serving static files
  .use(routes.root) // route controller for "/"
  .use("/profile", routes.profile); // route controller for "/profile/:username"
app.listen(PORT, HOST, () => {
  // listening to the port for incoming requests
  console.log(`server started running at ${HOST}:${PORT}`);
});
