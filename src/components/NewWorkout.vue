<script setup>
import { ref } from "vue";
import { useWorkoutStore } from "../stores/workout";

const props = defineProps({
  router: Object,
});

const newWorkout = ref({ name: "", notes: "" });

function handleSubmit() {
  if (newWorkout.value.name.trim() === "") return;

  useWorkoutStore().saveWorkoutToAPI(newWorkout.value);
  props.router.push("/workout");
}

function handleCancel() {
  props.router.go(-1);
}
</script>

<template>
  <div>
    <div class="title">
      <a href="" class="action" @click.prevent="handleCancel()">⟨</a>
      <span>Workout</span>
    </div>
    <div class="hg-list-group">
      <form @submit.prevent="handleSubmit">
        <p>
          <label
            >Name
            <input ref="name" v-model="newWorkout.name" required autofocus />
          </label>
        </p>
        <p>
          <label
            >Notes
            <textarea v-model="newWorkout.notes" placeholder="Notes"></textarea>
          </label>
        </p>
        <p>
          <button type="submit">Add Workout</button>
        </p>
      </form>
    </div>
  </div>
</template>
