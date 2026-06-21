// отвечает только за сетевые запросы к БД/серверу

export class ApiService {
    constructor(baseUrl = 'https://ourproject-production.up.railway.app/api') {
        this.baseUrl = baseUrl;
}

// Получить все задачи из БД
async fetchTasks() {
    try {
        const response = await fetch(`${this.baseUrl}/tasks`);
        if (!response.ok)  throw new Error('Ошибка при получении данных с сервера');
        return await response.json();
    } catch (error) {
        console.error('ApiService error: ', error);
        return [];
    }
}// короче кидаем запрос, получаем ответ, проверяем норм ли ответ, возвращаем джсон


// обновляем статус задачи
async updateTaskStatus(task_id, columnId) { 
    try {
        const response = await fetch(`${this.baseUrl}/tasks/${task_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ column: columnId }) 
        });
        return response.ok;
    } catch (error) {
        console.error('ApiService error: ', error);
        return false;
    }
}// в кратце так и есть, отправляем запрос ПАТЧ с измененной колонкой

// удалить задачу из БД
async deleteTask(task_id) {
    try {
        const response = await fetch(`${this.baseUrl}/tasks/${task_id}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error('ApiService error: ', error);
        return false;
    }
}// ну так же, что сказать, просто метод delete

    async createTask(task) {
        try {
            const response = await fetch(`${this.baseUrl}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
            return await response.json();
        } catch (error) {
            console.error('ApiService: ', error);
            return null;
        }
    }// ладно, бесполезные такие коменты, просто разные вопросы, ну тут пост, просто для создания
}