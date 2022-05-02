import Vue from 'vue'
import Vuex from 'vuex'
import patientData from '../assets/patientData.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    patientData: JSON.parse(JSON.stringify(patientData)),
    login: {
      username: '',
      password: '',
    },
    who_login: {
      id: '',
      nurseId: '',
      firstName: '',
      lastName: '',
      username: '',
    },
    createUser: {
      nurseId: '',
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      confirm_password: '',
    },
    createPatient: {
      firstName: '',
      lastName: '',
      gender: '',
      dob: null,
      weight: null,
      height: null,
      waistline: null,
      fall_history: null,
    },
    search: '',
    allPatient: [],
    patientId: '',
    patient: {},
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
        firstName: '',
        lastName: '',
        username: '',
      }
    },
    setCreateUser(state, payload) {
      state.createUser = payload
    },
    resetCreateUser(state) {
      state.createUser = {
        nurseId: '',
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirm_password: '',
      }
    },
    setCreatePatient(state, payload) {
      state.createPatient = payload
    },
    resetCreatePatient(state) {
      state.createPatient = {
        firstName: '',
        lastName: '',
        gender: '',
        dob: null,
        weight: null,
        height: null,
        waistline: null,
        fall_history: null,
      }
    },
    setSearch(state, payload) {
      state.search = payload
    },
    setAllPatient(state, payload) {
      state.allPatient = payload
    },
    setPatientId(state, payload) {
      state.patientId = payload
    },
    resetPatientId(state) {
      state.patientId = null
    },
    setPatient(state, payload) {
      state.patient = payload
    },
    resetPatient(state) {
      state.patient = null
    },
  },
  actions: {
    createLogin({ state, commit, dispatch }) {
      return Vue.axios
        .post(
          `https://my-app-krmt9.ondigitalocean.app/api/auth/sign-in`,
          state.login,
        )
        .then(res => {
          const token = res.data.accessToken
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
      const token = () => localStorage.getItem('token')
      return Vue.axios
        .get(`https://my-app-krmt9.ondigitalocean.app/api/auth/me`, {
          headers: { Authorization: 'Bearer ' + token },
        })
        .then(res => {
          commit('setWhoLogin', res.data)
        })
    },
    createUser({ state, commit }) {
      return Vue.axios
        .post(
          `https://my-app-krmt9.ondigitalocean.app/api/user`,
          state.createUser,
        )
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
    createPatient({ state, commit }) {
      /*
            firstName: '',
      lastName: '',
      gender: '',
      dob: null,
      weight: null,
      height: null,
      waistline: null,
      fall_history: null,
      */
      const bodyAdapter = original => ({
        firstName: original.firstName,
        lastName: original.lastName,
        dob: original.dob,
        gender: original.gender.toLowerCase(),
        height: +original.height || 0,
        weight: +original.weight || 0,
        bmi: +parseFloat(
          +original.weight / Math.pow(+original.height / 100, 2),
        ).toFixed(0),
        waistline: +original.waistline,
        fallHistory: +original.fall_history,
      })
      return Vue.axios
        .post(
          `https://my-app-krmt9.ondigitalocean.app/api/patient`,
          bodyAdapter(state.createPatient),
        )
        .then(res => {
          console.log(res)
          commit('resetCreatePatient')
          return Promise.resolve()
        })
        .catch(e => {
          console.log(e.response.data)
          return Promise.reject(e.response.data)
        })
    },
    getAllPatient({ state, commit }) {
      Vue.axios
        .get(`https://my-app-krmt9.ondigitalocean.app/api/patient`, {
          params: {
            search: state.search,
          },
        })
        .then(data => {
          commit('setAllPatient', data.data)
        })
    },
    getPatientById({ state, commit }) {
      Vue.axios
        .get(
          `https://my-app-krmt9.ondigitalocean.app/api/patient/${state.patientId}`,
        )
        .then(data => {
          commit('setPatient', data.data[0])
        })
    },
  },
  modules: {},
})
