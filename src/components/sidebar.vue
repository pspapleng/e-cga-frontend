<template>
  <div class="sidebar">
    <div class="top">
      <!-- ปุ่มรายชื่อ -->
      <div style="padding: 20px 25px 10px" v-show="!isNotAssessment">
        <b-button
          style="
              background-color: #1e3a8a;
              color: white;
              border-color: #1e3a8a;
            "
          size="is-large"
          @click="changeToPatient"
        >
          <b-icon icon="menu" size="is-medium"> </b-icon>
        </b-button>
      </div>
      <div style="padding: 20px 25px 10px" v-show="isNotAssessment">
        <b-button
          style="background-color: white; color: #1e3a8a; border-color: white"
          size="is-large"
        >
          <b-icon icon="menu-open" size="is-medium"> </b-icon>
        </b-button>
      </div>
      <!-- ปุ่มแบบประเมิน -->
      <div style="padding: 0px 25px 0px" v-show="isNotAssessment">
        <b-button
          :disabled="haveUserData"
          style="
              background-color: #1e3a8a;
              color: white;
              border-color: #1e3a8a;
            "
          size="is-large"
        >
          <b-icon icon="text-box-outline" size="is-medium"> </b-icon>
        </b-button>
      </div>
      <div style="padding: 0px 25px 0px" v-show="!isNotAssessment">
        <b-button
          style="background-color: white; color: #1e3a8a; border-color: white"
          size="is-large"
        >
          <b-icon icon="text-box-outline" size="is-medium"> </b-icon>
        </b-button>
      </div>
    </div>
    <!-- ปุ่มแอคเคาท์ -->
    <div style="position: absolute; bottom: 20px; left: 10px">
      <b-tooltip
        type="is-light"
        position="is-right"
        :triggers="['click']"
        :auto-close="['outside', 'escape']"
      >
        <template v-slot:content>
          <p class="py-2 mx-3">
            {{ who_login.firstName }} {{ who_login.lastName }}
          </p>
          <b-button
            type="is-danger"
            icon-left="sign-out-alt"
            icon-pack="fas"
            size="is-small"
            @click="logOut()"
            expanded
            >Log out
          </b-button>
        </template>
        <b-button
          style="background-color: #1e3a8a; color: white; border-color: #1e3a8a"
          size="is-large"
        >
          <b-icon icon="account-circle" size="is-large"> </b-icon>
        </b-button>
      </b-tooltip>
    </div>
    <!-- </b-menu> -->
  </div>
  <!-- </b-sidebar> -->
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      checklist: '',
      checkfrom: '',
    }
  },
  name: 'Sidebar',
  methods: {
    ...mapActions(['createLogout']),
    logOut() {
      this.createLogout()
        .then(() => {
          this.$router.push({ name: 'Login' })
        })
        .catch(e => {
          console.log(e.details)
        })
    },
    changeToPatient() {
      // this.$router.push({ name: 'Dashboard' })
      if (this.haveUserData) {
        // this.keep_ans = JSON.parse(JSON.stringify(this.default_keep_ans));
        // console.log(this.default_keep_ans);
        // console.log(this.keep_ans);
        // this.resetAns()
        // this.keep_result = JSON.parse(JSON.stringify(this.default_keep_results))

        this.$router.push({ name: 'Dashboard' })
      } else {
        alert("can't")
      }
    },
  },

  computed: {
    ...mapState([
      'who_login',
      'patient',
      'result_id',
      'keep_ans',
      'keep_result',
    ]),
    currentRouteName() {
      return this.$route.name
    },
    isNotAssessment() {
      return (
        this.$route.name === 'Dashboard' || this.$route.name === 'AddPatient'
      )
    },
    haveUserData() {
      return this.patient !== [] || this.result_id !== null
    },
  },
}
</script>

<style>
.sidebar {
  height: 100%;
  width: 80px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #1e3a8a;
  /* overflow-x: hidden; */
}
.top {
  overflow: hidden;
}
.b-tooltip .tooltip-content {
  font-size: 1.05rem;
  font-weight: 500;
}
/* .b-sidebar .sidebar-content {
  background-color: #1e3a8a;
  -webkit-box-shadow: 0px 0px 0px 0px rgb(10 10 10 / 10%);
} */
</style>
