import { Router } from "express";
const router = Router();
router.get("/:username", (request, response) => {
  const userParam = request.params.username;
  response.json({
    status: false,
    message: `profile for ${userParam} will be available soon`,
  });
});


export { router as profile }; 