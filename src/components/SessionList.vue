<script setup>
import { computed } from "vue";
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
}

async function editSession(session) {
  props.router.push("session/" + session.id);
}
</script>

<template>
  <div>
    <div class="title">
      <span>fitness</span>
    </div>
    <div class="newSession">
      <div
        v-for="workout in sortedWorkoutList"
        :key="workout.id"
        @click="addSession(workout)"
        class="workout"
      >
        {{ workout.name }}
      </div>
    </div>
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
            >
              <span class="name">{{ session.name }}</span>
              <span>{{ session.notes }}</span>
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
  overflow-x: scroll
  white-space: nowrap
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
</style>