<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { addDays } from "date-fns";
import { useWorkoutStore } from "../stores/workout";
import { useSessionStore } from "../stores/session";
import { formatDateForComparison } from "../utils/dateFormatter";

const workoutStore = useWorkoutStore();
const workoutList = workoutStore.workoutList;
const sessionStore = useSessionStore();
const sessionList = sessionStore.sessionList;
const searchFilter = ref("");
const router = useRouter();
const route = useRoute();

onMounted(() => {
  workoutStore.loadWorkoutsFromAPI();
  sessionStore.loadSessionsFromAPI();
});

const today = new Date();
function todayStr() {
  return formatDateForComparison(new Date());
}

const filteredWorkoutList = computed(() => {
  if (searchFilter.value === "") return workoutStore.workoutList;
  return workoutStore.workoutList.filter((workout) =>
    workout.name.toLowerCase().includes(searchFilter.value.toLowerCase())
  );
});

const filteredSessionList = computed(() => {
  if (searchFilter.value === "") return sessionStore.sessionList;
  return sessionStore.sessionList.filter((session) =>
    session.name.toLowerCase().includes(searchFilter.value.toLowerCase())
  );
});

const newWorkout = ref({
  name: "",
  notes: "",
});

async function addWorkout(newWorkout) {
  if (!newWorkout.name) return;
  await workoutStore.saveWorkoutToAPI(newWorkout);

  resetForm();
  router.go(-1);
}

async function addSession(workout) {
  const performedAt = formatDateForComparison(new Date());
  const newSession = {
    name: workout.name,
    performedAt: performedAt,
    notes: workout.notes,
  };
  await sessionStore.saveSessionToAPI(newSession);
}

async function updateWorkout(updatedWorkout) {
  const idx = workoutStore.workoutList.findIndex(
    (p) => p.id === updatedWorkout.id
  );
  if (idx >= 0) {
    workoutStore.workoutList[idx] = { ...updatedWorkout };
    await workoutStore.updateWorkoutInAPI(updatedWorkout);
  }
  resetForm();
  router.go(-1);
}

function resetForm() {
  newWorkout.value = {
    id: undefined,
    name: "",
    notes: "",
  };
}

function cancelForm() {
  resetForm();
  router.go(-1);
}

function editWorkout(workoutObject) {
  newWorkout.value = workoutObject;
  router.push("/form");
}

async function deleteWorkout(deletedWorkout) {
  await workoutStore.deleteWorkoutFromAPI(deletedWorkout);

  resetForm();
  router.go(-1);
}
</script>

<template>
  <div class="fitness">
    <div v-if="route.name !== 'form'" class="title">
      <span>Fitness</span>
      <input
        class="action"
        v-model="searchFilter"
        type="search"
        placeholder="Search"
      />
    </div>
    <div v-if="route.name === 'form'" class="title">
      <span>Workout</span>
      <a href="" class="action" @click.prevent="cancelForm()">X</a>
    </div>

    <router-view
      v-slot="{ Component, route }"
      :workoutList="filteredWorkoutList"
      :initialWorkout="newWorkout"
      :onEdit="editWorkout"
      :onAddSession="addSession"
      @add="addWorkout"
      @update="updateWorkout"
      @delete="deleteWorkout"
      @cancel="() => router.go(-1)"
    >
      <component
        :is="Component"
        v-bind="
          route.meta.name === 'form'
            ? {
                initialWorkout: newWorkout,
                onAdd: addWorkout,
                onUpdate: updateWorkout,
                onDelete: deleteWorkout,
                onCancel: () => router.push('/'),
              }
            : {
                workoutList: filteredWorkoutList,
                sessionList: filteredSessionList,
                onEdit: editWorkout,
                onAddSession: addSession,
              }
        "
      />
    </router-view>

    <nav class="tab-bar">
      <ul>
        <li>
          <router-link to="/session" active-class="active">Session</router-link>
        </li>
        <li>
          <router-link to="/form" class="plus-link" active-class="active">
            <span class="plus-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="2"
                  width="18"
                  height="18"
                  rx="6"
                  fill="#f8f8f8"
                  stroke="#42b883"
                  stroke-width="2"
                />
                <path
                  d="M11 7V15"
                  stroke="#42b883"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M7 11H15"
                  stroke="#42b883"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </span>
          </router-link>
        </li>
        <li>
          <router-link to="/workout" active-class="active"
            >Workouts</router-link
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="sass" scoped>
.tab-bar
  width: 500px
  display: flex
  justify-content: center
  padding-bottom: 0.3rem
  position: sticky
  bottom: 0
  z-index: 1000
  background-color: white
  border-top: 1px solid #42b883

  ul
    display: flex
    gap: 0.5rem
    list-style: none
    margin: 0
    padding: 0

    li
      margin: 0

      a
        display: flex
        align-items: center
        justify-content: center
        border: none
        border-top: 3px solid transparent
        padding: 0.5rem 1.5rem
        font-size: 1rem
        font-weight: 500
        color: #333
        cursor: pointer
        border-radius: 0
        background: transparent
        text-decoration: none

        &.active
          border-top: 3px solid #42b883
          color: #42b883

        &:hover
          background: #b2dfdb

      .plus-link
        padding: 0.5rem 1.1rem

        .plus-icon
          display: flex
          align-items: center
          justify-content: center
          width: 28px
          height: 28px
          background: #fff
          border-radius: 8px
          box-shadow: 0 1px 4px #0001
          transition: background 0.2s

        &.active .plus-icon,
        &:hover .plus-icon
          background: #e0f7ef
          border-color: #42b883
</style>

<style lang="sass" scoped>
@import url("https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap")

.fitness
  width: 500px
  padding: 0
  background: white
  border-radius: 8px
  box-shadow: 0 2px 8px #0001
  font-family: "Google Sans", Arial, sans-serif

  .title
    display: block
    padding-bottom: 1.3rem
    padding-top: 1.3rem
    padding-left: 1.3rem
    border-bottom: 1px solid #42b883
    color: #388e3c

    span
      font-weight: bold
      font-size: 1.3rem

    .action
      float: right
      margin-right: 1.3rem

    a.action
      font-size: 1.3rem
      color: #388e3c

    input
      width: 60%
      padding: 0.3rem
      margin-top: 0.1rem

      &:focus
        border-color: #42b883

  .app-box
    padding-bottom: 1rem
</style>

<style lang="sass">
.hg-list-group
  margin-top: 0
  padding: 0.7rem
  padding-bottom: 4rem

  .hg-list-date-group
    padding: 0.5rem
    padding-left: 1rem
    padding-right: 1rem
    margin: 0

    &.today
      border-bottom: 3px solid #42b883
      background-color: #b2dfdb

    & .heading
      margin-top: 0
      font-weight: bold
      /* color: #1976d2 */
      color: #388e3c
      display: block

    ul
      padding-left: 1rem
      margin-top: 0
      margin-bottom: 0

      li
        margin-top: 0.1rem
        margin-bottom: 0.3rem
        cursor: pointer

        span
          margin-left: 0.7rem
          font-size: 0.8rem

        span.name
          font-weight: bold
</style>

<style lang="sass" scoped>
@media (max-width: 400px)
  /* Mobile-specific styles */

  .fitness
    width: 100%

    .title

      span
        font-size: 1.1rem

      input
        width: 50%

  .tab-bar
    width: 100%
    position: fixed
    padding-bottom: 0

    ul
      width: 100%
      li
        width: 33%
        a
          padding: 0.7rem
        a.plus-link
          padding: 0.7rem
</style>

<style lang="sass" scoped>
/* The switch - the box around the slider */
.switch
  position: relative
  display: inline-block
  width: 45px
  height: 24px
  margin-top: 0.75rem

  /* Hide default HTML checkbox */
  & input
    opacity: 0
    width: 0
    height: 0

/* The slider */
.slider
  position: absolute
  cursor: pointer
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: #ccc
  -webkit-transition: .4s
  transition: .4s

  &:before
    position: absolute
    content: ""
    height: 16px
    width: 16px
    left: 4px
    bottom: 4px
    background-color: white
    -webkit-transition: .4s
    transition: .4s

  input:checked + &
    background-color: #42b883

  input:focus + &
    box-shadow: 0 0 1px #42b883

  input:checked + &:before
    -webkit-transform: translateX(22px)
    -ms-transform: translateX(22px)
    transform: translateX(22px)

  /* Rounded sliders */
  &.round
    border-radius: 24px

  &.round:before
    border-radius: 50%
</style>