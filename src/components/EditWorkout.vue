<script setup>
import { ref, computed, watch } from "vue";
import { useWorkoutStore } from "../stores/workout";

const props = defineProps({
  router: Object,
  id: String,
});

const workoutStore = useWorkoutStore();
if (!workoutStore.workoutList.length) {
  props.router.push("/workout");
}

const workout = ref({ name: "", notes: "" });
const _workout = () => {
  return workoutStore.workoutList.find((w) => {
    return w.id.toString() === props.id.toString();
  });
};
if (_workout) {
  workout.value = { ..._workout() };
}

async function handleSubmit() {
  if (workout.value.name.trim() === "") return;

  const idx = workoutStore.workoutList.findIndex(
    (w) => w.id === workout.value.id
  );
  if (idx >= 0) {
    workoutStore.workoutList[idx] = { ...workout.value };
    await workoutStore.updateWorkoutInAPI(workout.value);
  }

  props.router.push("/workout");
}

async function deleteWorkout() {
  await workoutStore.deleteWorkoutFromAPI(workout.value);

  props.router.push("/workout");
}
</script>

<template>
  <div>
    <div class="title">
      <span>Workout</span>
      <a href="" class="action" @click.prevent="handleCancel()">X</a>
    </div>
    <div class="hg-list-group">
      <form @submit.prevent="handleSubmit">
        <p>
          <label>Name</label>
          <input ref="name" v-model="workout.name" required />
        </p>
        <p>
          <label>Notes</label>
          <textarea v-model="workout.notes" placeholder="Notes"></textarea>
        </p>
        <p>
          <button type="submit">Update Workout</button>
        </p>
        <p>
          <a href="" @click.prevent="deleteWorkout">Delete Workout</a>
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
  select,
  textarea
    display: block

  input,
  textarea,
  select
    padding: 0.5rem
    border: 1px solid #ccc
    border-radius: 4px
    font-family: "Google Sans", Arial, sans-serif

  span.fieldValue
    font-weight: bold
</style>