import Vue from 'vue'
import Vuex from 'vuex'
// import patientData from '../assets/patientData.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
      /*
          "id": 1,
    "hn": "000000001",
    "first_name": "weare",
    "last_name": "admin",
    "dob": "2000-11-02",
    "gender": "FEMALE",
    "created_at": "2021-04-11",
    "height": 161.5,
    "weight": 55,
    "bmi": 23,
    "waistline": 32,
    "fall_history": 0,
    "user_id": 1,
    "result_id": 1,
    "result": {
      "MNA": "ได้คะแนน 12 คะแนน ภาวะโภชนาการปกติ",
      "OCA": "เนื้อเยื่อในช่องปาก มีความผิดปกติ ปัญหาการเคี้ยวอาหาร/การกลืน มีความผิดปกติ โปรดส่งต่อเพื่อเข้ารับบริการทางทันตกรรมกับบุคลากร",
      "UIA": "มีภาวะกลั้นปัสสาวะไม่อยู่ในระดับรุนแรงน้อย (ปริมาณปัสสาวะที่กลั้นไม่อยู่ไม่กี่หยดและเกิดอาการบ่อยเล็กน้อย)",
      "EYES": "ไม่มีปัญหาการมองเห็น",
      "KNEE": "มีอาการเสียงดังกรอบแกรบในข้อเข่าขณะเคลื่อนไหว โอกาสที่จะเป็นโรคข้อเข่าเสื่อมน้อย",
      "LTTA": "ได้คะแนน 12 คะแนน ไม่ต้องได้รับการดูแลระยะยาว สนับสนุนการส่งเสริมสุขภาพ",
      "MMSE": "เรียนสูงกว่าระดับประถมศึกษา ได้คะแนน 25 คะแนน ไม่มีภาวะสมองเสื่อม",
      "OSTA": "ค่า OSTA เท่ากับ 7 ไม่มีความเสี่ยงต่อโรคกระดูกพรุน",
      "TUGT": "ใช้เวลาในการเดิน 20 วินาที และ ยืนได้ 20 วินาที ไม่มีความเสี่ยงต่อภาวะหกล้ม",
      "SLEEP": "มีปัญหาการนอนหลับ (นอนไม่หลับ) โปรดส่งต่อให้แพทย์เพื่อทำการตรวจวินิจฉัยเพื่อยืนยันผล",
      "IQCODE": "ผู้สูงอายุไม่มีภาวะสมองเสื่อม",
      "TGDS-15": "ได้คะแนน 4 คะแนน ไม่มีภาวะซึมเศร้า",
      "FallRisk": "ได้คะแนน 20 คะแนน มีความเสี่ยงที่จะหกล้มสูง"
    },
    "result_date": "2021-04-14"
      */
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
  },
  modules: {},
})
