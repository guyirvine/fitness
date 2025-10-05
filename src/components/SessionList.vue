<script setup>
import { defineProps, defineEmits, computed, ref } from "vue";
import { formatDate, formatDateForComparison } from "../utils/dateFormatter";

const props = defineProps({
  workoutList: {
    type: Array,
    required: true,
  },
  sessionList: {
    type: Array,
    required: true,
  },
  onEdit: Function,
  onAddSession: Function,
});

const emit = defineEmits(["addSession"]);
const editingSession = ref("");

const todayStr = formatDateForComparison(new Date());

const sortedSessionList = computed(() => {
  props.sessionList.sort((a, b) => {
    if (a.performedAt < b.performedAt) return 1;
    if (a.performedAt > b.performedAt) return -1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  return props.sessionList;
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

function editSession(session) {
  if (editingSession.value && editingSession.value !== session) {
    editingSession.value.editing = false;
  }
  editingSession.value = session;
  session.editing = true;
}

function handleSubmit(session) {
  console.log("handleSubmit", session);
  session.editing = false;
  // emit('updateSession', session);
}
</script>

<template>
  <div class="hg-list-group">
    <div class="newSession">
      <div
        v-for="workout in workoutList"
        :key="workout.id"
        @click="onAddSession(workout)"
        class="workout"
      >
        {{ workout.name }}
      </div>
    </div>
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
          <li v-for="session in obj.sessions" :key="session.id">
            <span class="name" @click="editSession(session)">{{
              session.name
            }}</span>
            <span
              v-if="!session.editing && session.notes"
              @click="editSession(session)"
              >{{ session.notes }}</span
            >
            <form
              v-if="session.editing"
              @submit.prevent="handleSubmit(session)"
            >
              <input
                type="text"
                id="notes"
                v-model="session.notes"
                class="notes"
                autofocus
              />

              <button
                @click="handleDelete()"
                title="Delete session"
                class="icon-btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="33"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <!-- Rectangle with rounded corners -->
                  <rect
                    x="2"
                    y="2"
                    width="28"
                    height="28"
                    rx="8"
                    fill="none"
                    stroke="#43a047"
                    stroke-width="2"
                  />
                  <!-- Trash Icon -->
                  <g
                    stroke="#43a047"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="7 10 25 10" />
                    <path
                      d="M23 10v10a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V10m3 0V8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
                    />
                    <line x1="14" y1="14" x2="14" y2="20" />
                    <line x1="18" y1="14" x2="18" y2="20" />
                  </g>
                </svg>
              </button>
            </form>
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <div class="empty-state">No sessions</div>
    </template>
  </div>
</template>

<style lang="sass" scoped>
.newSession
  overflow-x: scroll
  white-space: nowrap
  padding-bottom: 0.7rem
  border-bottom: 1px solid #42b883

  .workout
    border-radius: 0.7rem
    margin: 0.3rem
    padding: 0.3rem 0.7rem
    background-color: #42b883
    color: white
    display: inline-block
    cursor: pointer

input.notes
  width: 60%
  padding: 0.3rem
  margin-top: 0.1rem
  margin-left: 1rem

  &:focus
    border-color: #42b883

button.icon-btn
  background-color: transparent
  padding: 0
  padding-left: 0.5rem
  padding-top: 0.3rem

form
  display: flex
</style>