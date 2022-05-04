import Vue from 'vue'
import Vuex from 'vuex'
import questions from '../assets/questions.json'
import keep_ans from '../assets/ans.json'
import * as dayjs from 'dayjs'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    questions: questions,
    keep_ans: keep_ans,
    result: [],
    result_id: null,
    patientData: [],
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
    MNA: '',
    OCA: '',
    FallRisk: '',
    TUGT: '',
    EYES: '',
    KNEE: '',
    OSTA: '',
  },
  mutations: {
    setResultId(state, payload) {
      state.result_id = payload
    },
    setAllResult(state, payload) {
      state.result = payload
    },
    setMNA(state, payload) {
      state.MNA = payload
    },
    setOCA(state, payload) {
      state.OCA = payload
    },
    setFallRisk(state, payload) {
      state.FallRisk = payload
    },
    setTUGT(state, payload) {
      state.TUGT = payload
    },
    setEYES(state, payload) {
      state.EYES = payload
    },
    setKNEE(state, payload) {
      state.KNEE = payload
    },
    setOSTA(state, payload) {
      state.OSTA = payload
    },
    setAns(state, payload) {
      let idd = payload.id
      let target = state.keep_ans.find(e => e.ques_id === idd)
      target.ans_value = payload.value
      target.ans_title = payload.title
      target.u_id = state.patientId
    },
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
      state.patientData = payload
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
      return Vue.axios
        .get(`https://my-app-krmt9.ondigitalocean.app/api/patient`, {
          params: {
            search: state.search,
          },
        })
        .then(data => {
          const patientAdapter = original => ({
            ...original,
            id: original.id,
            hn: String(original.hn).padStart(6, '0'),
            first_name: original.firstName,
            last_name: original.lastName,
            fall_history: original.fallHistory,
            dob: '2000-11-02',
            gender: original.gender.toUpperCase(),
            result: original.result[0], // TODO: please fix
            result_date: original.createdAt,
          })
          return commit(
            'setAllPatient',
            data.data.map(e => patientAdapter(e)),
          )
        })
    },
    getPatientById({ state, commit }) {
      Vue.axios
        .get(
          `https://my-app-krmt9.ondigitalocean.app/api/patient/${state.patientId}`,
        )
        .then(data => {
          const patientAdapter = original => ({
            ...original,
            hn: String(original.hn).padStart(6, '0'),
            first_name: original.firstName,
            last_name: original.lastName,
            created_at:
              (original.result || []).length > 0
                ? original.result[0]?.createdAt
                : new Date().toString(),
          })
          commit('setPatient', patientAdapter(data.data))
        })
    },
    editUser({ state }, payload) {
      const toJSON = p => ({
        firstName: p.first_name,
        lastName: p.last_name,
        dob: new Date(p.dob).toISOString(),
        gender: p.gender.toLowerCase(),
        height: +p.height,
        weight: +p.weight,
        bmi: +parseFloat(+p.bmi).toFixed(0),
        waistline: +p.waistline,
        fallHistory: +p.fall_history,
      })

      return Vue.axios
        .patch(
          `https://my-app-krmt9.ondigitalocean.app/api/patient/${state.patientId}`,
          toJSON(payload),
        )
        .then(res => {
          return Promise.resolve(res)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },
    deleteUser({ state }) {
      return Vue.axios
        .delete(
          `https://my-app-krmt9.ondigitalocean.app/api/patient/${state.patientId}`,
        )
        .then(res => {
          return Promise.resolve(res)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },
    createResult({ state, commit }) {
      /*
          MNA: '',
    OCA: '',
    FallRisk: '',
    TUGT: '',
    EYES: '',
    KNEE: '',
    OSTA: '',
     */
      const body = {
        result: {
          MNA: state.MNA,
          OCA: state.OCA,
          FallRisk: state.FallRisk,
          TUGT: state.TUGT,
          EYES: state.EYES,
          KNEE: state.KNEE,
          OSTA: state.OSTA,
        },
        patientId: state.patientId,
      }
      return Vue.axios
        .post(`https://my-app-krmt9.ondigitalocean.app/api/result`, body)
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
    getAllResultByUid({ commit }, id) {
      // console.log("in action", state.UserId);
      return Vue.axios
        .get(`https://my-app-krmt9.ondigitalocean.app/api/result`, {
          params: {
            patientId: id,
          },
        })
        .then(result => {
          const resultAdaptee = result.data.map(e => ({
            result_id: e.id,
            result_date: dayjs(e.createdAt).toDate(),
            result: e.result,
            u_fname: e.patient.firstName,
            u_lname: e.patient.lastName,
            n_fname: e.patient.user.firstName,
            n_lname: e.patient.user.lastName,
          }))
          console.log(resultAdaptee)
          commit('setAllResult', resultAdaptee)
          commit('setResultId', result.data[0].id)
          return Promise.resolve()
        })
    },
    createLogout({ commit }) {
      localStorage.removeItem('token')
      commit('resetWhoLogin')
      return Promise.resolve()
    },
  },
  modules: {},
})
