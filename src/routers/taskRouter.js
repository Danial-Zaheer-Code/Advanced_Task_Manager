import express from "express"
import { check } from "express-validator";
import { validateRequest } from "../middleware/requestValidation.js";
import { validateToken } from "../middleware/tokenValidation.js";
import { addTask, changeStatus, deleteTask } from "../controllers/taskController.js";


export const router = express.Router();

router.post("/", 
    check("title")
        .notEmpty()
        .withMessage("Task Title is Required")
        .trim()
        .escape(),
    validateRequest,
    validateToken,
    addTask
)

router.delete("/:id", 
    validateRequest,
    validateToken,
    deleteTask
)

router.put("/status/:id",
    validateRequest,
    validateToken,
    changeStatus
)