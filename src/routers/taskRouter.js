import express from "express"
import { check } from "express-validator";
import { validateRequest } from "../middleware/requestValidation.js";
import { validateToken } from "../middleware/tokenValidation.js";
import { addTask, changeStatus, deleteTask, getCompletedTasks, getTodayTasks, markCompleted } from "../controllers/taskController.js";

export const router = express.Router();

router.post("/add", 
    check("title")
        .notEmpty()
        .withMessage("Task Title is Required")
        .trim()
        .escape(),
    check("repeatDays")
        .exists()
        .withMessage("Days to Repeat Tasks is compulsory")
        .isArray({ min: 1 })
        .withMessage('Array cannot be empty'),
    validateRequest,
    validateToken,
    addTask
)

router.delete("/delete", 
    validateRequest,
    validateToken,
    deleteTask
)

router.patch("/status",
    check("id")
        .exists()
        .withMessage("Id is rquired")
        .isNumeric()
        .withMessage("Id must be a number"),
    check("status")
        .exists()
        .withMessage("Status is required")
        .isString()
        .withMessage("Status must be a string"),
    validateRequest,
    validateToken,
    changeStatus
)

router.get("/today",
    validateRequest,
    validateToken,
    getTodayTasks
)

router.get("/completed",
    validateRequest,
    validateToken,
    getCompletedTasks
)

router.patch("/markComplete",
    validateRequest,
    validateToken,
    markCompleted
)