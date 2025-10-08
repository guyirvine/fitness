<script setup>
import { ref, computed } from "vue";
import { useSessionStore } from "../stores/session";

const props = defineProps({
  router: Object,
  id: String,
});

const sessionStore = useSessionStore();
if (!sessionStore.sessionList.length) {
  props.router.push("/session");
}

const session = ref({ name: "", notes: "" });
const _session = computed(() => {
  const s = sessionStore.sessionList.find((w) => {
    return w.id.toString() === props.id.toString();
  });
  if (s) session.value = { ...s };

  return s;
});

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
      <span>{{ _session.name }}</span>
      <a href="" class="action" @click.prevent="handleCancel()">X</a>
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
            <input v-model="session.notes" placeholder="Notes" type="text" />
          </label>
        </p>
        <p>
          <label
            >Workout Notes
            <pre>{{ session.workoutNotes }}</pre>
          </label>
        </p>
        <p>
          <button type="submit">Update Session</button>
        </p>
        <p>
          <a href="" @click.prevent="deleteSession">Delete Session</a>
        </p>
      </form>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.hg-list-group
  position: relative

  .panel-actions
    position: absolute
    top: 0.5rem
    right: 0.5rem
    z-index: 2

.icon-btn
  span
    position: relative
    top: -0.3rem

form
  display: flex
  flex-direction: column
  gap: 0.5rem

  p
    margin: 0
    padding: 0.5rem
    padding-left: 1rem
    padding-right: 1rem

  label
    display: block
    text-align: left

  input
    width: 50%

  textarea
    width: calc(100% - 2rem)

  input,
  textarea,
  select
    display: block
    padding: 0.5rem
    border: 1px solid #ccc
    border-radius: 4px
    font-family: "Google Sans", Arial, sans-serif

  span.fieldValue
    font-weight: bold
</style>