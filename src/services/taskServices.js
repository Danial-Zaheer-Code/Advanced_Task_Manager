import { connectionPool } from "../config/dbConfig.js";

export async function addTaskDB(userId, task) {
    try {
        const [result] = await connectionPool.query(`
			INSERT INTO tasks (title, user_id, task_status)
			VALUES (?, ?);
			`, [task.title, userId, "active"]);
        

        const taskId = result.insertId;

        const repeatDays = task.repeatDays.map(day => [taskId,day]);
        return await connectionPool.query(`
            INSERT INTO tasks_repeat(task_id, day_repeat)
            VALUES ?
            `, [repeatDays]);

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
        const [result] = await connectionPool.query(`
        DELETE FROM tasks
        WHERE id=?
        `, [id]);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function isTaskExists(title) {
    try {
        return await connectionPool.query(`
        SELECT EXISTS (SELECT 1 FROM tasks WHERE title=?) AS task_exists;
        `, [title]);
    } catch (error) {
        throw error;
    }
}

export async function getTodayTasksDB() {
    try {
        const [rows] = await connectionPool.query(`
            SELECT t.id, t.title
            FROM tasks t
            INNER JOIN tasks_repeat r
            ON t.id = r.task_id
            WHERE t.user_id = 1
            AND t.task_status = 'active'
            AND r.day_repeat = DAYNAME(CURDATE())
            AND NOT EXISTS (
                SELECT 1
                FROM tasks_completed c
                WHERE c.task_id = t.id
                AND c.completion_date = CURDATE()
            );
            `)
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getCompletedTasksDB() {
    try {
        const [rows] = await connectionPool.query(`
            SELECT t.id, t.title, c.completion_date
            FROM tasks t
            INNER JOIN tasks_completed c ON t.id = c.task_id;
            `)
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function markCompletedDB(id){
    try {
        const [result] = await connectionPool.query(`
            INSERT IGNORE INTO tasks_completed(task_id)
            VALUES(?)
            `,[id]);
        return result;
    } catch (error) {
        throw error;
    }
}