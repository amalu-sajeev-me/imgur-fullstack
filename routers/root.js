import { mongoose, User } from "./db/index.js";
import bcrypt from "bcrypt";
import { Router } from "express";
const db_url = `mongodb+srv://dev:passmein@cluster0.gsr2u.mongodb.net/imgur?retryWrites=true&w=majority`;
const router = Router();
router.get("/", (request, response) => {
  response.json({ status: false });
});

router.post("/", async (request, response) => {
  console.log(request.session);
  console.log(request.method, request.url);
  const { form, username, password } = request.body;
  const isBodyValid = !!(form && username && password);
  if (!isBodyValid)
    return response.json({ status: false, message: "invalid request body" });
  const hash = await bcrypt.hash(password, 12);
  await mongoose
    .connect(db_url)
    .then(() => console.log("db connected"))
    .catch((error) => console.log(error.message));
  const userData = await User.findOne({ username });
  const userExist = !!userData;
  if (form === "signup" && userExist)
    return response.json({ status: false, message: "choose another username" });
  else if (form === "signup") {
    let newUser = await new User({ username, password: hash }).save();
    return response.json({ status: true, message: "account created" });
  }
  if (form === "login" && userExist) {
    const validPassword = await bcrypt.compare(password, userData.password);
    console.log(username, "logged in");
    console.log(password, validPassword);
    if (validPassword) {
      request.session.user_id = userData._id;
      request.session.name = "amalu";
      console.log(userData._id);
      return response.json({ status: true });
    }
    else
      return response.json({ status: false, message: "invalid credentials" });
  }
  response.json({ status: false, message: "invalid credentials" });
});

export { router as root };
