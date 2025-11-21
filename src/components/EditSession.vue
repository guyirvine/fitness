<script setup>
import { ref, computed, watch } from "vue";
import { useSessionStore } from "../stores/session";
import { format } from "date-fns";

const props = defineProps({
  router: Object,
  id: String,
});

const sessionStore = useSessionStore();
if (!sessionStore.sessionList.length) {
  props.router.push("/session");
}

const session = ref({ name: "", notes: "" });
const _session = computed(() =>
  sessionStore.sessionList.find((w) => w.id.toString() === props.id.toString())
);

// Copy the found session into the local `session` ref without causing
// side-effects inside the computed getter (which can cause recursive updates).
watch(
  _session,
  (s) => {
    if (s) {
      session.value = { ...s };
      if (!session.value.workoutNotes) {
        session.value.workoutNotes = " - ";
      }
    }
  },
  { immediate: true }
);

async function handleSubmit() {
  if (session.value.name.trim() === "") return;

  await sessionStore.updateSessionInAPI(session.value);

  props.router.push("/session");
}

async function deleteSession() {
  await sessionStore.deleteSessionFromAPI(session.value);

  props.router.push("/session");
}

async function handleCancel() {
  props.router.go(-1);
}
</script>

<template>
  <div>
    <div class="title">
      <a href="" class="action" @click.prevent="handleCancel()">⟨</a>
      <span
        >{{ _session.name }}

        <span class="date">{{
          format(new Date(_session.performedAt), "cccc, d MMM").toUpperCase()
        }}</span>
      </span>
    </div>
    <div class="hg-list-group">
      <form @submit.prevent="handleSubmit">
        <p>
          <label
            >Name
            <input ref="name" v-model="session.name" required autofocus />
          </label>
        </p>
        <p>
          <label
            >Notes
            <textarea v-model="session.notes" placeholder="Notes"></textarea>
          </label>
        </p>
        <p>
          <label
            >Session date
            <input
              v-model="session.performedAt"
              placeholder="Performed At"
              type="date"
            />
          </label>
        </p>
        <div class="workout-notes">
          <span>Workout Notes</span>
          <pre>{{ session.workoutNotes }}</pre>
        </div>
        <p>
          <button type="submit">Update Session</button>
        </p>
        <p>
          <a href="" @click.prevent="deleteSession" class="delete"
            >Delete Session</a
          >
        </p>
      </form>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.title
  .date
    font-size: 0.8rem
    margin-left: 1rem
    text-transform: capitalize
</style>