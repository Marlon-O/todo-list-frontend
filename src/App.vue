<script>
import gql from 'graphql-tag'

export default {
  data() {
    return {
      show_logout_dialog: false,
      logging_off: false,
      me: {
        name: '',
        tasks: []
      },
    }
  },

  apollo: {
    me: gql`query {
      me {
        id
        name
        tasks {
          id
          name
          description
          status
        }
      }
    }`,
  },

  computed: {
    loggedIn() {
      return localStorage.getItem('access_token') ? true : false
    }
  },

  methods: {
    handleLogout() {
      this.$apollo.mutate({
          mutation: gql`mutation {
              logout {
                status
                message
              }
          }`,
      }).then((data) => {
          localStorage.removeItem('access_token')

          window.location.href = '/login'
      }).catch((error) => {
          console.error(error)
      })
    }
  },

  watch: {
    me: {
      handler(newValue) {
        if (!this.$store.state.user) {
          this.$store.commit('setUser', newValue)
          this.$store.commit('setTasks', newValue.tasks)
        }
      },
      deep: true
    }
  }
}
</script>

<template>
  <div>
    <nav class="main-nav container" v-if="loggedIn">
      <h2>Welcome back, {{ me.name }}</h2>
      <ul>
        <li><a href="#" @click.prevent="show_logout_dialog = true">Logout</a></li>
      </ul>
    </nav>

    <v-dialog persistent max-width="450" v-model="show_logout_dialog">
          <v-card>
          <v-card-title>Confirmation</v-card-title>
          <v-card-text>Are you sure you want to <strong>logout</strong>?</v-card-text>
          <v-card-text class="text-right">
              <v-btn @click.prevent="show_logout_dialog = false" rounded class="mr-2">
              Cancel
              </v-btn>
              <v-btn @click.prevent="handleLogout" :loading="logging_off" rounded color="primary">
              OK
              </v-btn>
          </v-card-text>
          </v-card>
      </v-dialog>

    <main class="container" :class="{ 'login-component': !loggedIn }">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.login-component {
  height: 100vh;
  display: flex;
  align-items: center;
}
</style>