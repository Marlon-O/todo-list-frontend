import { createStore } from 'vuex'

const store = createStore({
    state: {
        user: null,
        tasks: [],
    },

    mutations: {
        setUser(state, user) {
            state.user = user
        },

        setTasks(state, tasks) {
            state.tasks = [...state.tasks, ...tasks]
        },
        
        updateTask(state, task) {
            const new_set_of_tasks = state.tasks
            const index = new_set_of_tasks.findIndex(obj => obj.id === task.id);

            if (index !== -1) new_set_of_tasks[index] = { ...new_set_of_tasks[index], ...task }      
        },

        deleteTask(state, task) {
            const new_set_of_tasks = state.tasks.filter(obj => obj.id !== task.id);

            state.tasks = new_set_of_tasks
        }
    },
})

export default store