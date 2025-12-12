import express from "express";
import { askToAssistant, getCurrentUser, updateController } from "../controllers/user.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";


const userRouter = express.Router();

userRouter.get("/current",isAuth,getCurrentUser);
userRouter.put("/update",isAuth , upload.single("assistantImage"),updateController);
userRouter.post("/asktoassistant" ,isAuth , askToAssistant)

export default userRouter;