<script setup>
import { ref, computed } from "vue";
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
const _workout = computed(() => {
  const w = workoutStore.workoutList.find((w) => {
    return w.id.toString() === props.id.toString();
  });
  if (w) workout.value = { ...w };

  return w;
});

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

async function handleCancel() {
  props.router.go(-1);
}

async function deleteWorkout() {
  await workoutStore.deleteWorkoutFromAPI(workout.value);

  props.router.push("/workout");
}
</script>

<template>
  <div>
    <div class="title">
      <a href="" class="action" @click.prevent="handleCancel()">⟨</a>
      <span>{{ _workout.name }}</span>
    </div>
    <div class="hg-list-group">
      <form @submit.prevent="handleSubmit">
        <p>
          <label
            >Name
            <input ref="name" v-model="workout.name" required />
          </label>
        </p>
        <p>
          <label
            >Notes
            <textarea v-model="workout.notes" placeholder="Notes"></textarea>
          </label>
        </p>
        <p>
          <button type="submit">Update Workout</button>
        </p>
        <p>
          <a href="" @click.prevent="deleteWorkout" class="delete"
            >Delete Workout</a
          >
        </p>
      </form>
    </div>
  </div>
</template>
