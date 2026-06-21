import { ApiService } from './services/ApiServices.js';

export class Store {
    constructor() {
        this.state = { tasks: [] };
        this.listeners = [];// короче это нам нужно длля отслеживания кому важно что чтото поменялось. subscribe и notify для того же. listeners список кого, subscribe для добавления, notify для"оповещения"
        this.api = new ApiService(); 
    }

    subscribe(listener) { this.listeners.push(listener); }
    notify() { this.listeners.forEach(l => l(this.state)); }

    async fetchTasks() {
        this.state.tasks = await this.api.fetchTasks();
        this.notify();
    }

    async addTask(name, columnId) {
        try {
            const newTask = {
                task_id: crypto.randomUUID(), 
                name: name,
                date: new Date().toISOString().split('T'),
                board_id: 1, 
                column: columnId,
                priority: 1
            };

            const result = await this.api.createTask(newTask);
            if (result && result.success) {
                this.state.tasks.push(newTask);
                this.notify();
            } else {
                throw new Error("Ошибка сервера");
            }
        } catch (e) {
            alert('Задача не добавлена, проверь консоль сервера.');
        }
    }

    async moveTask(taskId, columnId) {
        const prev = [...this.state.tasks];
        this.state.tasks = this.state.tasks.map(t => 
            t.task_id === taskId ? { ...t, column: columnId } : t
        );
        this.notify();

        const success = await this.api.updateTaskStatus(taskId, columnId);
        if (!success) {
            this.state.tasks = prev;
            this.notify();
        }
    }

    async archiveTask(taskId) {
        await this.moveTask(taskId, 99); 
    }

    async deleteTask(taskId) {
        const success = await this.api.deleteTask(taskId);
        if (success) {
            this.state.tasks = this.state.tasks.filter(t => t.task_id !== taskId);
            this.notify();
        }
    }
}