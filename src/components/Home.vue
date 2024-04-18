<script>
import gql from 'graphql-tag'

export default {
    data() {
        return {
            processing: false,
            headers: [
                { title: 'Name', align: 'start', key: 'name' },
                { title: 'Description', align: 'start', key: 'description' },
                { title: 'Status', align: 'start', key: 'status' },
                { text: 'Actions', value: 'action', key: 'action' },
            ],
            dialogs: {
                delete: {
                    id: '',
                    show: false,
                    deleting: false,
                },
                edit: {
                    show: false,
                    payload: {
                        id: '',
                        name: '',
                        description: '',
                        status: '',
                    },
                    updating: false,
                },
                create: {
                    show: false,
                    payload: {
                        name: '',
                        description: '',
                    },
                    creating: false,
                },
            },
        }
    },

    methods: {
        handleAddTask(item) {
            this.dialogs.create.show = true
            this.dialogs.create.payload.name = ''
            this.dialogs.create.payload.description = ''
        },

        handleCreate() {
            this.dialogs.create.creating = true

            this.$apollo.mutate({
                mutation: gql`mutation($user_id: ID!, $name: String!, $description: String!, $status: TaskStatus!) {
                    createTask(user_id: $user_id, name: $name, description: $description, status: $status) {
                        id
                        name
                        description
                        status
                    }
                }`,
                variables: {
                    user_id: this.$store.state.user?.id,
                    name: this.dialogs.create.payload.name,
                    description: this.dialogs.create.payload.description,
                    status: 'TODO'
                },
            }).then((data) => {
                this.$store.commit('setTasks', [data.data.createTask])
                this.dialogs.create.show = false
            }).catch((error) => {
                console.error(error)
            }).finally(() => {
                this.dialogs.create.creating = false
            })
        },

        handleEditTask(item) {
            this.dialogs.edit.show = true
            this.dialogs.edit.payload = { ...this.dialogs.edit.payload, ...item }
        },

        handleEdit() {
            this.dialogs.edit.updating = true

            this.$apollo.mutate({
                mutation: gql`mutation($id: ID!, $user_id: ID!, $name: String!, $description: String!, $status: TaskStatus!) {
                    updateTask(id: $id, user_id: $user_id, name: $name, description: $description, status: $status) {
                        id
                        name
                        description
                        status
                    }
                }`,
                variables: {
                    id: this.dialogs.edit.payload.id,
                    user_id: this.$store.state.user?.id,
                    name: this.dialogs.edit.payload.name,
                    description: this.dialogs.edit.payload.description,
                    status: this.dialogs.edit.payload.status
                },
            }).then((data) => {
                this.$store.commit('updateTask', data.data.updateTask)
                this.dialogs.edit.show = false
            }).catch((error) => {
                console.error(error)
            }).finally(() => {
                this.dialogs.edit.updating = false
            })
        },

        handleDeleteTask(item) {
            this.dialogs.delete.show = true
            this.dialogs.delete.id = item.id
        },

        handleDelete() {
            this.dialogs.delete.deleting = true

            this.$apollo.mutate({
                mutation: gql`mutation($id: ID!) {
                    deleteTask(id: $id) {
                        id
                    }
                }`,
                variables: {
                    id: this.dialogs.delete.id,
                },
            }).then((data) => {
                this.$store.commit('deleteTask', data.data.deleteTask)
                this.dialogs.delete.show = false
            }).catch((error) => {
                console.error(error)
            }).finally(() => {
                this.dialogs.delete.deleting = false
            })
        },

        handleChangeStatus(status, item) {
            this.$apollo.mutate({
                mutation: gql`mutation($id: ID!, $user_id: ID!, $name: String!, $description: String!, $status: TaskStatus!) {
                    updateTask(id: $id, user_id: $user_id, name: $name, description: $description, status: $status) {
                        id
                        name
                        description
                        status
                    }
                }`,
                variables: {
                    id: item.id,
                    user_id: this.$store.state.user?.id,
                    name: item.name,
                    description: item.description,
                    status: status
                },
            }).then((data) => {
                this.$store.commit('updateTask', data.data.updateTask)
            }).catch((error) => {
                console.error(error)
            })
        },
    },

    computed: {
        tasks() {
            return this.$store.state.tasks;
        }
    }
}
</script>

<template>
    <div>
        <v-dialog persistent max-width="600" v-model="dialogs.create.show">
            <v-card>
                <v-card-title>Create Task</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <div class="mb-4">
                                <v-text-field :loading="dialogs.create.creating" v-model="dialogs.create.payload.name"
                                    label="Name" outlined hide-details></v-text-field>
                            </div>

                            <div class="my-4">
                                <v-text-field :loading="dialogs.create.creating" v-model="dialogs.create.payload.description"
                                    label="Description" outlined hide-details></v-text-field>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-text class="text-right">
                    <v-btn v-if="!dialogs.create.creating" @click.prevent="dialogs.create.show = false" rounded class="mr-2">
                        Cancel
                    </v-btn>
                    <v-btn @click.prevent="handleCreate" :loading="dialogs.create.creating" rounded color="primary">
                        Save
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog persistent max-width="600" v-model="dialogs.edit.show">
            <v-card>
                <v-card-title>Edit Task</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <div class="mb-4">
                                <v-text-field :loading="dialogs.edit.updating" v-model="dialogs.edit.payload.name"
                                    label="Name" outlined hide-details></v-text-field>
                            </div>

                            <div class="my-4">
                                <v-text-field :loading="dialogs.edit.updating" v-model="dialogs.edit.payload.description"
                                    label="Description" outlined hide-details></v-text-field>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-text class="text-right">
                    <v-btn v-if="!dialogs.edit.updating" @click.prevent="dialogs.edit.show = false" rounded class="mr-2">
                        Cancel
                    </v-btn>
                    <v-btn @click.prevent="handleEdit" :loading="dialogs.edit.updating" rounded color="primary">
                        Save
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog persistent max-width="450" v-model="dialogs.delete.show">
            <v-card>
            <v-card-title>Delete Task</v-card-title>
            <v-card-text>Are you sure you want to <strong>delete</strong> this
                task?</v-card-text>
            <v-card-text class="text-right">
                <v-btn v-if="!dialogs.delete.deleting" @click.prevent="dialogs.delete.show = false" rounded class="mr-2">
                Cancel
                </v-btn>
                <v-btn @click.prevent="handleDelete" :loading="dialogs.delete.deleting" rounded color="primary">
                OK
                </v-btn>
            </v-card-text>
            </v-card>
        </v-dialog>

        <div class="actions-container">
            <v-row>
                <v-col cols="12">
                    <div class="create-task-container">
                        <v-btn @click.prevent="handleAddTask" rounded color="primary" size="small" variant="flat">
                            <v-icon small class="mr-2">mdi-plus</v-icon>
                            <span>Create New Task</span>
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>

        <v-data-table :loading="processing" :headers="headers" :items="tasks" height="400"
            item-value="id" items-per-page="10">
            <template v-slot:item.status="{ item }">
                <v-chip variant="flat" size="small" color="green" v-if="item.status == 'DONE'"> Done </v-chip>
                <v-chip variant="flat" size="small" color="primary" v-else> Todo </v-chip>
            </template>

            <template v-slot:item.action="{ item }">
                <v-menu transition="slide-y-transition">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical"></v-btn>
                    </template>

                    <v-list>
                        <v-list-item @click="handleChangeStatus('DONE', item)" link v-if="item.status != 'DONE'">
                            <div class="action-column-item">
                                <v-icon left>mdi-check</v-icon>
                                <span>Mark as done</span>
                            </div>
                        </v-list-item>

                        <v-list-item @click="handleChangeStatus('TODO', item)" link v-else>
                            <div class="action-column-item">
                                <v-icon left>mdi-check</v-icon>
                                <span>Mark as todo</span>
                            </div>
                        </v-list-item>

                        <v-list-item @click="handleEditTask(item)" link>
                            <div class="action-column-item">
                                <v-icon left>mdi-pencil</v-icon>
                                <span>Edit</span>
                            </div>
                        </v-list-item>

                        <v-list-item @click="handleDeleteTask(item)" class="text-danger" link>
                            <div class="action-column-item">
                                <v-icon left color="red">mdi-delete</v-icon>
                                <span>Delete</span>
                            </div>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-data-table>
    </div>
</template>

<style scoped>
.action-column-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.actions-container {
    margin-bottom: 1rem;
}

.create-task-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.mark-as-done-button {
    height: auto !important;
}

.mark-as-done-button--text {
    display: flex;
    align-items: center;
    gap: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
}
</style>