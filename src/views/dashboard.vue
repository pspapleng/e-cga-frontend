<template>
  <div>
    <section>
      <div class="columns is-gapless">
        <div class="column is-1">
          <Sidebar />
        </div>
        <div class="column is-11" id="righttext">
          <div>
            <h1
              style="
                font-size: 1.6667rem;
                text-align: left;
                font-weight: 600;
                padding: 20px 0px 0px;
              "
            >
              รายชื่อผู้ทำแบบประเมิน
            </h1>
          </div>
          <div style="padding: 20px 0px 0px">
            <b-field grouped>
              <b-input
                v-model="search_word"
                placeholder="Search..."
                type="search"
                icon="magnify"
              >
              </b-input>
              <router-link to="/AddPatient">
                <b-button
                  type="is-success"
                  icon-left="user-plus"
                  icon-pack="fas"
                  style="position: absolute; right: 50px"
                >
                  เพิ่ม
                </b-button>
              </router-link>
            </b-field>
          </div>
          <!-- ตาราง -->
          <div
            class="column is-12"
            style="padding-right: 30px; padding-left: 0px"
          >
            <b-table
              :data="patientList"
              :paginated="true"
              per-page="10"
              current-page.sync="1"
              pagination-position="bottom"
              default-sort-direction="DESC"
              sort-icon="arrow-up"
              sort-icon-size="is-small"
              default-sort="user.first_name"
              aria-next-label="Next page"
              aria-previous-label="Previous page"
              aria-page-label="Page"
              aria-current-label="Current page"
              style="text-align: left"
            >
              <b-table-column
                field="hn"
                label="HN"
                width="40"
                sortable
                centered
                v-slot="user"
              >
                {{ user.row.hn }}
              </b-table-column>

              <b-table-column
                field="first_name"
                label="ชื่อ"
                sortable
                v-slot="user"
              >
                <span>{{ user.row.first_name }}</span>
              </b-table-column>

              <b-table-column
                field="last_name"
                label="นามสกุล"
                sortable
                v-slot="user"
              >
                {{ user.row.last_name }}
              </b-table-column>

              <b-table-column label="เพศ" centered width="120" v-slot="user">
                <span>
                  {{ user.row.gender === 'MALE' ? 'ชาย' : 'หญิง' }}
                  <b-icon
                    pack="fas"
                    :icon="user.row.gender === 'MALE' ? 'mars' : 'venus'"
                  >
                  </b-icon>
                </span>
              </b-table-column>

              <b-table-column
                field="date"
                label="สถานะ"
                centered
                width="120"
                v-slot="user"
              >
                <router-link :to="`/results/${user.row.id}`">
                  <span
                    class="tag is-success is-light"
                    @click="seeResult(user.row)"
                    v-if="
                      user.row.result != null &&
                        today.getFullYear() -
                          new Date(user.row.result_date).getFullYear() <
                          1
                    "
                  >
                    ประเมินเมื่อ
                    {{ new Date(user.row.result_date).toLocaleDateString() }}
                  </span>
                </router-link>

                <span class="tag" v-if="user.row.result == null" disabled>
                  ไม่มีข้อมูลผลประเมิน
                </span>
              </b-table-column>

              <b-table-column width="100" v-slot="user" centered>
                <router-link to="/forms/form1">
                  <b-button
                    style="background-color: #1e3a8a; color: white"
                    size="is-small"
                    @click="doAssessment(user.row.id)"
                  >
                    ทำแบบประเมิน
                  </b-button>
                </router-link>
              </b-table-column>

              <b-table-column width="40" style="padding: 8px 6px" v-slot="user">
                <b-button
                  type="is-light"
                  icon-right="user"
                  icon-pack="fas"
                  size="is-small"
                  @click="
                    open(user.row.id),
                      (openPatient = true),
                      getAge(user.row.dob)
                  "
                />
              </b-table-column>

              <b-table-column width="40" v-slot="user">
                <b-button
                  type="is-light"
                  icon-right="pen"
                  icon-pack="fas"
                  size="is-small"
                  @click="
                    open(user.row.id),
                      (openEditPatient = true),
                      editHistory(user)
                  "
                />
              </b-table-column>

              <b-table-column width="40" v-slot="user">
                <b-button
                  type="is-light"
                  icon-right="trash"
                  icon-pack="fas"
                  size="is-small"
                  @click="DeleteUser(user.row, user.row.hn)"
                />
              </b-table-column>

              <template #bottom-left>
                <b>ทั้งหมด {{ patientList.length }} รายชื่อ</b>
              </template>
            </b-table>
          </div>
        </div>

        <!-- ดูประวัติ -->
        <b-modal v-model="openPatient" :can-cancel="false">
          <form class="card">
            <div class="column is-full" style="background-color: #1e3a8a">
              <div class="columns">
                <div class="column is-2" style="color: white">
                  <b-icon
                    pack="fas"
                    icon="user"
                    custom-size="fa-5x"
                    style="padding-top: 50px"
                  >
                  </b-icon>
                </div>
                <div class="column is-10">
                  <div class="columns">
                    <div
                      class="column is-6"
                      style="
                        padding: 20px 0px 0px;
                        text-align: left;
                        color: white;
                      "
                    >
                      <p style="font-size: 30px">
                        {{ patient.first_name }} {{ patient.last_name }}
                      </p>
                    </div>
                    <div
                      class="column is-2"
                      style="padding: 20px 20px 10px; color: white"
                    ></div>
                    <div
                      class="column is-4"
                      style="padding: 20px 20px 10px; color: white"
                    >
                      <p>วันที่เข้ารับบริการ</p>
                    </div>
                  </div>

                  <div class="columns">
                    <div
                      class="column is-3"
                      style="
                        padding: 0px 0px 20px;
                        text-align: left;
                        color: white;
                      "
                    >
                      <p>HN {{ patient.hn }}</p>
                    </div>
                    <div class="column is-5"></div>
                    <div
                      class="column is-4"
                      style="padding: 0px 20px 20px; text-align: center"
                    >
                      <b-field>
                        <b-input
                          icon="calendar-alt"
                          icon-pack="fas"
                          icon-size="large"
                          v-model="dateResult"
                          disabled
                        >
                        </b-input>
                      </b-field>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-full" id="bodybar">
              <div class="columns">
                <div
                  class="br column is-6"
                  style="padding: 20px 30px 3px; border-right-style: solid"
                >
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">ชื่อ</p>
                    <p class="level-right">
                      <strong> {{ patient.first_name }} </strong>
                    </p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">นามสกุล</p>
                    <p class="level-right">
                      <strong> {{ patient.last_name }} </strong>
                    </p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">เพศ</p>
                    <p class="level-right">
                      <strong> {{ patient.gender }} </strong>
                    </p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">อายุ</p>
                    <p class="level-right">
                      <strong> {{ getAge(patient.dob) }} </strong>
                    </p>
                    <p class="level-right">ปี</p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">วัน เดือน ปีเกิด</p>
                    <p class="level-right">
                      <strong>
                        {{ new Date(patient.dob).toLocaleDateString() }}
                      </strong>
                    </p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                </div>

                <div class="bl column is-6" style="padding: 20px 30px 3px">
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">น้ำหนัก</p>
                    <p style="padding-left: 30px">
                      <strong> {{ patient.weight }} </strong>
                    </p>
                    <p class="level-right">กิโลกรัม</p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">ส่วนสูง</p>
                    <p style="padding-left: 30px">
                      <strong> {{ patient.height }} </strong>
                    </p>
                    <p class="level-right">เซนติเมตร</p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">BMI</p>
                    <p>
                      <strong> {{ patient.bmi }} </strong>
                    </p>
                    <p class="level-right"></p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">รอบเอว</p>
                    <p style="padding-left: 30px">
                      <strong> {{ patient.waistline }} </strong>
                    </p>
                    <p class="level-right">นิ้ว</p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">ประวัติการล้มใน 1 ปี</p>
                    <p style="padding-left: 30px">
                      <strong> {{ patient.fallHistory }} </strong>
                    </p>
                    <p class="level-right">ครั้ง</p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                </div>
              </div>
            </div>

            <div class="column is-full" id="bodybar">
              <div class="columns">
                <div class="column is-5"></div>
                <div class="column is-2">
                  <b-button
                    style="
                      background-color: #1e3a8a;
                      color: white;
                      border-color: #1e3a8a;
                    "
                    @click="openPatient = !openPatient"
                    expanded
                    >กลับ
                  </b-button>
                </div>
                <div class="column is-5"></div>
              </div>
            </div>
          </form>
        </b-modal>

        <!-- แก้ไขประว้ติ -->
        <b-modal v-model="openEditPatient" :can-cancel="false"
          >>
          <form class="card">
            <div class="column is-full" style="background-color: #1e3a8a">
              <div class="columns">
                <div class="column is-2" style="color: white">
                  <b-icon
                    pack="fas"
                    icon="user"
                    custom-size="fa-5x"
                    style="padding-top: 50px"
                  >
                  </b-icon>
                </div>
                <div class="column is-10">
                  <div class="columns">
                    <div
                      class="column is-5"
                      style="
                        padding: 20px 0px 0px;
                        text-align: left;
                        color: white;
                      "
                    >
                      <p style="font-size: 30px">
                        {{ patient.first_name }} {{ patient.last_name }}
                      </p>
                    </div>
                    <div
                      class="column is-3"
                      style="padding: 20px 20px 10px; color: white"
                    ></div>
                    <div
                      class="column is-4"
                      style="padding: 20px 20px 10px; color: white"
                    >
                      <p>วันที่เข้ารับบริการ</p>
                    </div>
                  </div>

                  <div class="columns">
                    <div
                      class="column is-3"
                      style="
                        padding: 0px 0px 20px;
                        text-align: left;
                        color: white;
                      "
                    >
                      <p>HN {{ patient.hn }}</p>
                    </div>
                    <div class="column is-5"></div>
                    <div
                      class="column is-4"
                      style="padding: 0px 20px 20px; text-align: center"
                    >
                      <b-field>
                        <b-input
                          icon="calendar-alt"
                          icon-pack="fas"
                          icon-size="large"
                          v-model="dateResult"
                          disabled
                        >
                        </b-input>
                      </b-field>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-full" id="bodybar">
              <div class="columns">
                <div
                  class="br column is-6"
                  style="padding: 20px 30px 3px; border-right-style: solid"
                >
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">ชื่อ</p>
                    <b-field :type="{ 'is-danger': $v.editFirstName.$error }">
                      <b-input v-model="$v.editFirstName.$model" />
                      <template v-if="$v.editFirstName.$error">
                        <p
                          class="help is-danger"
                          v-if="!$v.editFirstName.required"
                        >
                          * กรุณากรอกชื่อ
                        </p>
                        <p
                          class="help is-danger"
                          v-if="!$v.editFirstName.onlyString"
                        >
                          ชื่อต้องเป็นตัวอักษรเท่านั้น
                        </p>
                        <p
                          class="help is-danger"
                          v-if="!$v.editFirstName.minLength"
                        >
                          ชื่อต้องมีความยาวขั้นต่ำ 2 ตัวอักษร
                        </p>
                      </template>
                    </b-field>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">นามสกุล</p>
                    <b-field :type="{ 'is-danger': $v.editLastName.$error }">
                      <b-input v-model="$v.editLastName.$model" />
                      <template v-if="$v.editLastName.$error">
                        <p
                          class="help is-danger"
                          v-if="!$v.editLastName.required"
                        >
                          * กรุณากรอกนามสกุล
                        </p>
                        <p
                          class="help is-danger"
                          v-if="!$v.editLastName.onlyString"
                        >
                          นามสกุลต้องเป็นตัวอักษรเท่านั้น
                        </p>
                        <p
                          class="help is-danger"
                          v-if="!$v.editLastName.minLength"
                        >
                          นามสกุลต้องมีความยาวขั้นต่ำ 2 ตัวอักษร
                        </p>
                      </template>
                    </b-field>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">เพศ</p>
                    <b-field :type="{ 'is-danger': $v.editGender.$error }">
                      <b-input v-model="$v.editGender.$model" />
                      <template v-if="$v.editGender.$error">
                        <p
                          class="help is-danger"
                          v-if="!$v.editGender.required"
                        >
                          * กรุณากรอกเพศ
                        </p>
                        <p
                          class="help is-danger"
                          v-if="!$v.editGender.GenderOnly"
                        >
                          * กรุณากรอกชาย หรือหญิง เท่านั้น
                        </p>
                      </template>
                    </b-field>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 30px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">อายุ</p>
                    <p class="level-right">
                      <strong> {{ getAge(patient.dob) }} </strong>
                    </p>
                    <p class="level-right">ปี</p>
                  </div>
                  <hr style="margin-top: 6px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p>ประวัติการล้มใน 1 ปี</p>
                    <b-field
                      :type="{ 'is-danger': $v.editFallHistory.$error }"
                      style="margin-bottom: 0px"
                    >
                      <b-input v-model="$v.editFallHistory.$model" />
                      <template v-if="$v.editFallHistory.$error">
                        <p
                          class="help is-danger"
                          v-if="!$v.editFallHistory.required"
                        >
                          * กรุณากรอกจำนวนครั้ง
                        </p>
                        <p
                          class="help is-danger"
                          v-if="
                            !(
                              $v.editFallHistory.integer &&
                              $v.editFallHistory.minValue
                            )
                          "
                        >
                          จำนวนครั้งต้องเป็นจำนวนเต็มมากกว่าหรือเท่ากับ 0
                        </p>
                      </template>
                    </b-field>
                    <p>ครั้ง</p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                </div>

                <div class="bl column is-6" style="padding: 20px 30px 3px">
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">วัน เดือน ปีเกิด</p>
                    <p class="level-right">
                      <b-field :type="{ 'is-danger': $v.editDOB.$error }">
                        <b-datepicker
                          v-model="$v.editDOB.$model"
                          position="is-right"
                          icon="calendar-today"
                          trap-focus
                        >
                        </b-datepicker>
                      </b-field>
                      <template v-if="$v.editDOB.$error">
                        <p class="help is-danger" v-if="!$v.editDOB.required">
                          * กรุณากรอกวันเดือนปีเกิด
                        </p>
                      </template>
                    </p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">น้ำหนัก</p>
                    <b-field
                      :type="{ 'is-danger': $v.editWeight.$error }"
                      style="margin-bottom: 0px"
                    >
                      <b-input v-model="$v.editWeight.$model" />
                      <template v-if="$v.editWeight.$error">
                        <p
                          class="help is-danger"
                          v-if="!$v.editWeight.required"
                        >
                          * กรุณากรอกน้ำหนัก
                        </p>
                        <p
                          class="help is-danger"
                          v-if="
                            !($v.editWeight.decimal && $v.editWeight.minValue)
                          "
                        >
                          น้ำหนักต้องเป็นตัวเลขมากกว่าหรือเท่ากับ 0
                        </p>
                      </template>
                    </b-field>
                    <p class="level-right">กิโลกรัม</p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">ส่วนสูง</p>
                    <b-field
                      :type="{ 'is-danger': $v.editHeight.$error }"
                      style="margin-bottom: 0px"
                    >
                      <b-input v-model="$v.editHeight.$model" />
                      <template v-if="$v.editHeight.$error">
                        <p
                          class="help is-danger"
                          v-if="!$v.editHeight.required"
                        >
                          * กรุณากรอกส่วนสูง
                        </p>
                        <p
                          class="help is-danger"
                          v-if="
                            !($v.editHeight.decimal && $v.editHeight.minValue)
                          "
                        >
                          ส่วนสูงต้องเป็นตัวเลขมากกว่าหรือเท่ากับ 0
                        </p>
                      </template>
                    </b-field>
                    <p class="level-right">เซนติเมตร</p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 30px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">BMI</p>
                    <p>
                      <strong> {{ patient.bmi }} </strong>
                    </p>
                    <p class="level-right"></p>
                  </div>
                  <hr style="margin-top: 6px; margin-bottom: 20px" />
                  <div class="level" style="margin-bottom: 0px">
                    <p class="level-left">รอบเอว</p>
                    <b-field
                      :type="{ 'is-danger': $v.editWaistline.$error }"
                      style="margin-bottom: 0px"
                    >
                      <b-input v-model="$v.editWaistline.$model" />
                      <template v-if="$v.editWaistline.$error">
                        <p
                          class="help is-danger"
                          v-if="!$v.editWaistline.required"
                        >
                          * กรุณากรอกรอบเอว
                        </p>
                        <p
                          class="help is-danger"
                          v-if="
                            !(
                              $v.editWaistline.decimal &&
                              $v.editWaistline.minValue
                            )
                          "
                        >
                          รอบเอวต้องเป็นตัวเลขมากกว่าหรือเท่ากับ 0
                        </p>
                      </template>
                    </b-field>
                    <p class="level-right">นิ้ว</p>
                  </div>
                  <hr style="margin-top: 0px; margin-bottom: 20px" />
                </div>
              </div>
            </div>

            <div class="column is-full" id="bodybar">
              <div class="columns">
                <div class="column is-4"></div>
                <div class="column is-2">
                  <b-button
                    style="
                      background-color: #017836;
                      color: white;
                      border-color: #017836;
                    "
                    @click="saveHistory(result)"
                    expanded
                    >บันทึก
                  </b-button>
                </div>
                <div class="column is-2">
                  <b-button
                    style="
                      background-color: #d12424;
                      color: white;
                      border-color: #d12424;
                    "
                    @click="openEditPatient = !openEditPatient"
                    expanded
                    >ยกเลิก
                  </b-button>
                </div>
                <div class="column is-4"></div>
              </div>
            </div>
          </form>
        </b-modal>
      </div>
    </section>
  </div>
</template>

<script>
import Sidebar from '@/components/sidebar.vue'
import { debounce } from 'debounce'
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  required,
  integer,
  minValue,
  decimal,
  minLength,
} from 'vuelidate/lib/validators'

function onlyString(value) {
  if (!value.match(/^[ก-์a-zA-Z]*$/gm)) {
    return false
  }
  return true
}

function GenderOnly(value) {
  if (!value.match(/MALE|FEMALE/)) {
    return false
  }
  return true
}

export default {
  components: {
    Sidebar,
  },
  name: 'dashboard',
  data() {
    return {
      openPatient: false,
      openEditPatient: false,
      result: {},
      today: new Date(),
      editFirstName: '',
      editLastName: '',
      editGender: '',
      editDOB: '',
      editWeight: '',
      editHeight: '',
      editWaistline: '',
      editFallHistory: '',
      search_word: '',
    }
  },
  validations: {
    editFirstName: {
      required,
      onlyString,
      minLength: minLength(2),
    },
    editLastName: {
      required,
      onlyString,
      minLength: minLength(2),
    },
    editGender: {
      required,
      GenderOnly,
    },
    editDOB: {
      required,
    },
    editWeight: {
      required,
      decimal,
      minValue: minValue(0),
    },
    editHeight: {
      required,
      decimal,
      minValue: minValue(0),
    },
    editWaistline: {
      required,
      decimal,
      minValue: minValue(0),
    },
    editFallHistory: {
      required,
      integer,
      minValue: minValue(0),
    },
  },
  computed: {
    dateResult() {
      return new Date(this.patient.created_at).toLocaleDateString()
    },
    editDateResult() {
      return new Date(this.patient.created_at)
    },
    ...mapState({
      patientList: 'patientData',
    }),
    ...mapState(['patient', 'who_login']),
  },
  methods: {
    ...mapMutations(['setSearch', 'setPatientId', 'setResultId']),
    ...mapActions([
      'getAllPatient',
      'getPatientById',
      'editUser',
      'deleteUser',
    ]),
    debounceInput: debounce(function(e) {
      this.setSearch(this.search_word)
      this.getAllPatient(e)
      console.log(e)
    }, 300),
    getAge(date) {
      var today = new Date()
      var birthDate = new Date(date)
      var age = today.getFullYear() - birthDate.getFullYear()
      var m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    },
    open(id) {
      this.setPatientId(id)
      this.getPatientById()
      console.log(id)
    },
    doAssessment(id) {
      this.setPatientId(id)
    },
    // seeResult(id) {
    //   console.log(id)
    //   this.setPatientId(id.u_id)
    //   this.setResultId(id.result_id)
    //   console.log(this.result_id)
    // },

    DeleteUser(user, index) {
      this.setPatientId(user.id)
      let confirmResult = confirm('are you sure!?')
      if (confirmResult) {
        this.deleteUser()
          .then(res => {
            console.log(res)
            var num = this.patientList.length
            for (var i = 0; i < num; i++) {
              if (parseInt(index) === parseInt(this.patientList[i].hn)) {
                this.patientList.splice(i, 1)
              }
            }
          })
          .catch(err => {
            console.log(err)
            alert(err.response.data.message)
          })
      }
    },
    editHistory({ row: data }) {
      console.log(data)
      this.editFirstName = data.first_name
      this.editLastName = data.last_name
      this.editGender = data.gender
      this.editDOB = new Date(data.dob)
      this.editWeight = data.weight || 0
      this.editHeight = data.height || 0
      this.editWaistline = data.waistline || 0
      this.editFallHistory = data.fall_history || 0
      this.setPatientId(data.id)
    },
    saveHistory(histy) {
      this.$v.$touch()

      // เช็คว่าในฟอร์มไม่มี error
      if (!this.$v.$invalid) {
        const payload = {
          first_name: this.editFirstName,
          last_name: this.editLastName,
          gender: this.editGender,
          dob: this.editDOB.toISOString().substring(0, 10),
          weight: this.editWeight,
          height: this.editHeight,
          bmi: parseFloat(
            this.editWeight / Math.pow(this.editHeight / 100, 2),
          ).toFixed(2),
          waistline: this.editWaistline,
          fall_history: this.editFallHistory,
          n_id: this.who_login.id,
        }

        this.editUser(payload)
          .then(() => {
            histy.first_name = this.editFirstName
            histy.last_name = this.editLastName
            histy.gender = this.editGender
            histy.dob = this.editDOB
            histy.weight = this.editWeight
            histy.height = this.editHeight
            histy.bmi = payload.bmi
            histy.waistline = this.editWaistline
            histy.fall_history = this.editFallHistory
            this.openEditPatient = !this.openEditPatient
            this.getAllPatient()
          })
          .catch(err => {
            console.log(err)
            alert('ERROR')
          })
      } else {
        alert('โปรดกรอกข้อมูลให้ถูกต้องทุกช่อง')
      }
    },
  },

  beforeRouteEnter(to, from, next) {
    console.log('before')
    next(vm => {
      vm.getAllPatient()
    })
  },
  watch: {
    search_word: {
      handler(val) {
        this.debounceInput()
        console.log(val)
        console.log('The form has changed!')
      },
    },
  },
}
</script>

<style>
#righttext {
  height: 100%;
}
.pagination-link.is-current {
  background-color: #1e3a8a;
  border-color: #1e3a8a;
}
.headbar {
  height: 100px;
}
.modal .modal-content {
  width: 70%;
}
.table td {
  padding: 0.45em 0.75em;
}
</style>
