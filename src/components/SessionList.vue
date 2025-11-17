<script setup>
import { computed, ref } from "vue";
import { formatDate, formatDateForComparison } from "../utils/dateFormatter";
import { useSessionStore } from "../stores/session";
import { useWorkoutStore } from "../stores/workout";

const props = defineProps({
  router: Object,
});

const todayStr = formatDateForComparison(new Date());

const sessionStore = useSessionStore();
const sortedSessionList = computed(() => {
  sessionStore.sessionList.sort((a, b) => {
    if (a.performedAt < b.performedAt) return 1;
    if (a.performedAt > b.performedAt) return -1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  return sessionStore.sessionList;
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
    </div>
    <ul class="newSession">
      <li
        v-for="workout in sortedWorkoutList"
        :key="workout.id"
        @click="addSession(workout)"
        class="workout"
      >
        {{ workout.name }}
      </li>
      <li
        :key="manageWorkouts"
        @click="props.router.push('/workout')"
        class="workout manageWorkouts"
      >
        <svg class="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6"></path>
          <path d="M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24"></path>
          <path d="M1 12h6m6 0h6"></path>
          <path d="M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
        </svg>
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
        <div class="empty-state">No sessions</div>
      </template>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.newSession
  margin: 0
  overflow-x: scroll
  white-space: nowrap
  padding-left: 0
  padding-top: 0.3rem
  padding-bottom: 0.3rem
  border-bottom: 1px solid #42b883

  .workout
    border-radius: 0.7rem
    margin: 0.3rem
    padding: 0.3rem 0.7rem
    background-color: #42b883
    color: white
    display: inline-block
    cursor: pointer

  .manageWorkouts
    background-color: #2196f3

  .settings-icon
    width: 1.2rem
    height: 1.2rem
    animation: spin 3s linear infinite

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