<script setup>
import { computed, ref } from "vue";
import { formatDate, formatDateForComparison } from "../utils/dateFormatter";
import { useSessionStore } from "../stores/session";
import { useWorkoutStore } from "../stores/workout";

const props = defineProps({
  router: Object,
});

const todayStr = formatDateForComparison(new Date());
const showSearchFilter = ref(false);
const searchFilter = ref("");
const sessionStore = useSessionStore();

const filteredSessionList = computed(() => {
  const criteria = searchFilter.value.trim().toLowerCase();
  if (criteria === "") return sessionStore.sessionList;

  return sessionStore.sessionList.filter((s) => {
    return s.name.toLowerCase().includes(criteria)
  })
});

const sortedSessionList = computed(() => {
  filteredSessionList.value.sort((a, b) => {
    if (a.performedAt < b.performedAt) return 1;
    if (a.performedAt > b.performedAt) return -1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  return filteredSessionList.value;
});

const workoutStore = useWorkoutStore();
const sortedWorkoutList = computed(() => {
  workoutStore.workoutList.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  return workoutStore.workoutList;
});

// Group sessions by performedAt date (YYYY-MM-DD)
const groupedByPerformedAt = computed(() => {
  const groups = {};
  let todayAssigned = false;
  sortedSessionList.value.forEach((session) => {
    if (!session.performedAt) return;
    const date = formatDateForComparison(new Date(session.performedAt));
    if (!groups[date]) {
      const today = !todayAssigned && date >= todayStr;
      if (today) todayAssigned = true;
      groups[date] = { date: date, today: today, sessions: [] };
    }
    groups[date].sessions.push(session);
  });
  return groups;
});

async function addSession(workout) {
  const performedAt = formatDateForComparison(new Date());
  const newSession = {
    name: workout.name,
    performedAt: performedAt,
    notes: "",
    workoutNotes: workout.notes,
  };
  await sessionStore.saveSessionToAPI(newSession);
}

function handleSubmit(session) {
  session.editing = false;
  sessionStore.updateSessionInAPI(session);
}

async function deleteSession(session) {
  await sessionStore.deleteSessionFromAPI(session);
  // clear any swipe state
  if (activeSwipedId.value === session.id) activeSwipedId.value = null;
}

async function editSession(session) {
  props.router.push("session/" + session.id);
}

// Swipe handling for mobile: reveal delete button when swiped left
const touchStartX = ref({});
const activeSwipedId = ref(null);
const SWIPE_THRESHOLD = 50;

function onTouchStart(e, id) {
  touchStartX.value[id] = e.touches[0].clientX;
}

function onTouchMove(e, id) {
  const startX = touchStartX.value[id];
  if (startX === undefined) return;
  const deltaX = e.touches[0].clientX - startX;
  // track swipe state for styling
  if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
    activeSwipedId.value = deltaX < 0 ? id : null;
  }
}

async function onTouchEnd(e, id) {
  const startX = touchStartX.value[id];
  if (startX === undefined) return;

  const deltaX = e.changedTouches[0].clientX - startX;
  // if swiped left far enough, delete
  if (deltaX < -SWIPE_THRESHOLD) {
    const session = sortedSessionList.value.find((s) => s.id === id);
    if (session) {
      await deleteSession(session);
    }
  }
  delete touchStartX.value[id];
}
</script>

<template>
  <div>
    <div class="title">
      <span>fitness</span>
      <div class="searchFilter">
        <input v-if="showSearchFilter" v-model="searchFilter" type="search" placeholder="Filter Sessions"/>
        <span @click.prevent="showSearchFilter = !showSearchFilter" role="button" aria-label="Toggle search">
          <svg class="icon-search" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
      </div>
    </div>
    <ul class="horizontal-button-list newSession">
      <li
        v-for="workout in sortedWorkoutList"
        :key="workout.id"
        @click="addSession(workout)"
        class="button workout"
      >
        {{ workout.name }}
      </li>
      <li
        :key="'manageWorkouts'"
        @click="props.router.push('/workout')"
        class="button button-action manageWorkouts"
      >
        Manage Workouts
      </li>
    </ul>
    <div class="hg-list-group">
      <template v-if="Object.keys(groupedByPerformedAt).length">
        <div
          v-for="(obj, date) in groupedByPerformedAt"
          :key="date"
          class="hg-list-date-group"
          :class="{ today: obj.today }"
          :id="'group-today'"
        >
          <span class="heading">{{ formatDate(date) }}</span>
          <ul>
            <li
              v-for="session in obj.sessions"
              :key="session.id"
              @click="editSession(session)"
              @touchstart="(e) => onTouchStart(e, session.id)"
              @touchmove="(e) => onTouchMove(e, session.id)"
              @touchend="(e) => onTouchEnd(e, session.id)"
              :class="{ 'swipe-delete': activeSwipedId === session.id }"
            >
              <div class="item-content">
                <span class="name">{{ session.name }}</span>
                <span class="notes">{{ session.notes }}</span>
              </div>
            </li>
          </ul>
        </div>
      </template>
      <template v-else>
        
        <template v-if="sortedWorkoutList.length">
          <div class="empty-state">
            <span class="error-next">Click one of the <b>workout buttons</b> above to add a session.</span>
          </div>
        </template>
        <template v-else>
          <div class="empty-state">
            <span class="error-name">To add a <b>session</b> you need at least one <b>workout</b> loaded.</span>
            <span class="error-next">Hit <b>Manage Workouts</b> above to get started.</span>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.title
  position: relative

  .searchFilter
    position: absolute
    right: 1rem
  
    span
      position: relative;
      top: 0.3rem;
      padding-left: 0.5rem;

@keyframes spin
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)

.hg-list-group

  .hg-list-date-group

    &.today

      ul
        border-left: 3px solid #42b883
        padding-left: 1.5rem

    ul
      padding-left: 1rem
      margin-top: 0
      margin-bottom: 0

      li
        margin-top: 0.1rem
        margin-bottom: 0.3rem
        cursor: pointer
        position: relative

        &.swipe-delete
          position: relative
          &::after
            content: 'Delete'
            position: absolute
            right: 0
            top: 0
            bottom: 0
            width: 4rem
            background-color: #ff5252
            color: white
            display: flex
            align-items: center
            justify-content: center
            font-size: 0.9rem

        span
          font-size: 0.8rem

        span.name
          font-weight: bold

        span.notes
          margin-left: 0.7rem
</style>