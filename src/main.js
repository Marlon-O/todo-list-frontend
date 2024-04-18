import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createWebHistory, createRouter } from 'vue-router'
import routes from './routes'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'
import { setContext } from '@apollo/client/link/context';
import store from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

const router = createRouter({
  history: createWebHistory(),
  base: '/',
  routes,
})

const isAuthenticated = localStorage.getItem('access_token') ? true : false

router.beforeEach(async (to, from) => {
  if (
    !isAuthenticated &&
    to.name !== 'login'
  ) {
    return { name: 'login' }
  }
})

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:8000/graphql',
});

const cache = new InMemoryCache()

const authLink = setContext((_, { headers }) => {
  const accessToken = localStorage.getItem('access_token');

  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

const apolloClient = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
})

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(apolloProvider)
app.use(store)

app.mount('#app')
