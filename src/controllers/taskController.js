import { connectionPool } from "../config/dbConfig.js";
import { addTaskDB, changeStatusDB, deleteTaskDB, isTaskExists, getTodayTasksDB, getCompletedTasksDB, markCompletedDB } from "../services/taskServices.js";

export async function addTask(req, res) {
    try {
        const userId = req.userId;
        const task = req.body;
        const [isExist] = await isTaskExists(task.title) 
        if (isExist[0].user_exists) {
            return res.status(409).json("Task already exists");
        }

        await addTaskDB(userId, task);
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

        if (!await isTaskExists(req.id)) {
            return res.status(404).json("Task does not exists");
        }

        await changeStatusDB(req.params.id, status);
        return res.status(200).json("Task updated successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong. Try again later");
    }
}

export async function deleteTask(req, res) {
    try {
        console.log("Delete Controller")
        await deleteTaskDB(req.params.id);
        console.log
        return res.status(200).json("Task Deleted Successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).json("Something went wrong. Try again later");
    }
}

export async function getTodayTasks(req, res){
    try {
        const tasks = await getTodayTasksDB();
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json("Something Went Wrong. Try again later");
    }
}

export async function getCompletedTasks(req, res){
    try {
        const completedTasks = await getCompletedTasksDB();
        res.status(200).json(completedTasks);
    } catch (error) {
        console.log(error);
        res.status(500).json("Something Went Wrong. Try again later");
    }
}

export async function markCompleted(req, res){
    try {
        await markCompletedDB(req.params.id);
        res.status(200).json("Marked Completed Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json("Something Went Wrong. Try again later");
    }
}