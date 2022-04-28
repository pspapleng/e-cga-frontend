import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: {
      username: '',
      password: '',
    },
    who_login: {
      id: '',
      nurseId: '',
      firstname: '',
      lastname: '',
      username: '',
    },
    createUser: {
      nurseId: '',
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      confirm_password: '',
    },
  },
  mutations: {
    setLogin(state, payload) {
      state.login = payload
    },
    resetLogin(state) {
      state.login = {
        username: '',
        password: '',
      }
    },
    setWhoLogin(state, payload) {
      state.who_login = payload
    },
    resetWhoLogin(state) {
      state.who_login = {
        id: '',
        nurseId: '',
        firstname: '',
        lastname: '',
        username: '',
      }
    },
    setCreateUser(state, payload) {
      state.createUser = payload
    },
    resetCreateUser(state) {
      state.createUser = {
        nurseId: '',
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        confirm_password: '',
      }
    },
  },
  actions: {
    createLogin({ state, commit, dispatch }) {
      return Vue.axios
        .post(`http://localhost:8081/api/auth/sign-in`, state.login)
        .then(res => {
          const token = res.data.token
          localStorage.setItem('token', token)
          dispatch('getWhoLogin')
          commit('resetLogin')
          return Promise.resolve()
        })
        .catch(e => {
          return Promise.reject(e.response.data)
        })
    },
    getWhoLogin({ commit }) {
      const token = localStorage.getItem('token')
      return Vue.axios
        .get(`http://localhost:8081/api/auth/me`, {
          headers: { Authorization: 'Bearer ' + token },
        })
        .then(res => {
          commit('setWhoLogin', res.data)
        })
    },
    createUser({ state, commit }) {
      return Vue.axios
        .post(`http://localhost:8081/api/user`, state.createUser)
        .then(res => {
          console.log(res)
          commit('resetCreateUser')
          return Promise.resolve()
        })
        .catch(e => {
          console.log(e.response.data)
          return Promise.reject(e.response.data)
        })
    },
  },
  modules: {},
})
