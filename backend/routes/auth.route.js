import express from "express";
import { signUp ,LogIn ,logout } from "../controllers/auth.controller.js";


const authRouter = express.Router();

authRouter.post("/signup",signUp);
authRouter.post("/signin",LogIn);
authRouter.get("/logout",logout);



export default authRouter;