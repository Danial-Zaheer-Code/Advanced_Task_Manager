import { connectionPool } from "../config/dbConfig.js";

export async function addTaskDB(userId, task) {
    try {
        const [result] = await connectionPool.query(`
			INSERT INTO tasks (title, user_id)
			VALUES (?, ?);
			`, [task.title, userId]);

        console.log(result);
        return result;

    } catch (error) {
        throw error;
    }
}

export async function changeStatusDB(id, status) {
    try {
        const [result] = await connectionPool.query(`
        UPDATE tasks
        SET task_status=?
        WHERE id=?
        `, [status, id]);
        return result
    } catch (error) {
        throw error;
    }
}

export async function deleteTaskDB(id) {
    try {
        console.log("Running query");
        const [result] = await connectionPool.query(`
        DELETE FROM tasks
        WHERE id=?
        `, [id]);
            console.log("Query ran successfully");
        return result;
    } catch (error) {
        throw error;
    }
}

export async function isTaskExists(title) {
    try {
        return await connectionPool.query(`
        SELECT EXISTS (SELECT 1 FROM tasks WHERE title=?) AS user_exists;
        `, [title]);
    } catch (error) {
        throw error;
    }
}

export function getAllTasks() {

}

export function getTodayTasks() {

}

function getTasks(filter) {

}