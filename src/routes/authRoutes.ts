import  express from "express";
import { checkEmail, login, register } from "../controllers/authController";
const router= express.Router()
router.post('/register',register)
router.post('/login',login)
router.post('/checkEmail',checkEmail)

export default router;  