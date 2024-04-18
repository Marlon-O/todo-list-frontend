<script>
import gql from 'graphql-tag'

export default {
    data() {
        return {
            loading: false,

            username: '',
            password: '',
        }
    },

    methods: {
        handleLogin() {
            this.loading = true

            this.$apollo.mutate({
                mutation: gql`mutation ($data: LoginInput!) {
                    login(input: $data) {
                        access_token
                    }
                }`,
                variables: {
                    data: {
                        username: this.username,
                        password: this.password,
                    }
                },
            }).then((data) => {
                localStorage.setItem('access_token', data?.data?.login?.access_token)

                window.location.href = '/'
            }).catch((error) => {
                console.error(error)
            }).finally(() => this.loading = false)
        }
    }
}
</script>

<template>
    <v-card color="#FFF">
        <v-card-title>
            <h2>Login</h2>
        </v-card-title>

        <v-card-item>
            <v-text-field 
                label="Username"
                v-model="username"
                :loading="loading"
            ></v-text-field>

            <v-text-field 
                label="Password" 
                type="password"
                v-model="password"
                :loading="loading"
            ></v-text-field>

            <div class="card-actions">
                <v-btn 
                    variant="outlined"
                    :loading="loading"
                    @click="handleLogin"
                >
                    Login
                </v-btn>
            </div>
        </v-card-item>
    </v-card>
</template>

<style scoped>
.v-card {
    width: 100%;
    padding: 2rem 1rem;
    margin: 0 auto;
}

.v-card-title h2 {
    text-align: center;
}

.card-actions {
    text-align: right;
}

@media screen and (min-width: 768px) {
    .v-card {
        max-width: 500px;
    }
}
</style>