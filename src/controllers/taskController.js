import { connectionPool } from "../config/dbConfig.js";
import * as taskServices from "../services/taskServices.js"
export async function addTask(req, res) {
    try {
        const userId = req.userId;
        const task = req.body;
        const isExist = await taskServices.isTaskExists(task.title) 
        if (isExist) {
            return res.status(409).json("Task already exists");
        }

        await taskServices.addTaskDB(userId, task);
        return res.status(201).json("Task created successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong. Try again later");
    }
}

export async function changeStatus(req, res) {
    try {
        const status = req.body.status.toLowerCase();

        if(status != "active" && status != "inactive"){
            res.status(400).json("Wrong status");
        }

        const isExist = await taskServices.isTaskExistsWithId(req.body.id) 
        if (!isExist) {
            return res.status(409).json("Task does not exists");
        }

        const hasChanged = await taskServices.changeStatusDB(req.body.id, status);

        if(!hasChanged){
            return res.status(200).json(`Status is alrady ${status}`)
        }

        return res.status(200).json("Task Status updated successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong. Try again later");
    }
}

export async function deleteTask(req, res) {
    try {
        const isExist = await taskServices.isTaskExistsWithId(req.body.id);

        if(!isExist){
            return res.status(409).json("Task does not exists");
        }

        await taskServices.deleteTaskDB(req.body.id);
        return res.status(200).json("Task Deleted Successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong. Try again later");
    }
}

export async function getTodayTasks(req, res){
    try {
        const tasks = await taskServices.getTodayTasksDB(req.userId);
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json("Something Went Wrong. Try again later");
    }
}

export async function getCompletedTasks(req, res){
    try {
        const completedTasks = await taskServices.getCompletedTasksDB(req.userId);
        res.status(200).json(completedTasks);
    } catch (error) {
        console.log(error);
        res.status(500).json("Something Went Wrong. Try again later");
    }
}

export async function markCompleted(req, res){
    try {
        const isExist = await taskServices.isTaskExistsWithId(req.body.id);

        if(!isExist){
            return res.status(408).json("Task does not exist");
        }

        const isCompleted = await taskServices.isCompletedToday(req.body.id);
        if(isCompleted){
            return res.status(200).json("Already Completed")
        }
        await taskServices.markCompletedDB(req.body.id);
        res.status(200).json("Marked Completed Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json("Something Went Wrong. Try again later");
    }
}

export async function getAllTasks(req,res) {
    try {
        const allTasks = await taskServices.getAllTasksDB(req.userId);
        res.status(200).json(allTasks);
    } catch (error) {
        console.log(error);
        res.status(500).json("Something Went Wrong. Try again later");
    }
}