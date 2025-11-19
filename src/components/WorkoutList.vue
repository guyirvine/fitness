<script setup>
import { defineProps, computed, onMounted } from "vue";
import { formatDate } from "../utils/dateFormatter";
import { useWorkoutStore } from "../stores/workout";

const props = defineProps({
  router: Object,
});

const workoutStore = useWorkoutStore();

onMounted(() => {
  workoutStore.loadWorkoutsFromAPI();
});

const sortedWorkoutList = computed(() => {
  workoutStore.workoutList.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  return workoutStore.workoutList;
});

async function editWorkout(workout) {
  props.router.push("workout/" + workout.id);
}
</script>

<template>
  <div>
    <div class="title">
      <a href="" class="action" @click.prevent="props.router.push('/session')">⟨</a>
      <span>Workouts</span>
    </div>
    <ul class="horizontal-button-list newWorkout" @click="props.router.push('/newworkout')">
      <li
        class="button button-action"
      >
        Add a Workout
      </li>
    </ul>
    <div class="hg-list-group">
      <template v-if="sortedWorkoutList.length">
        <div>
          <ul class="workoutList">
            <li
              v-for="workout in sortedWorkoutList"
              :key="workout.id"
              class="hg-list-date-group"
              @click="editWorkout(workout)"
            >
              <span class="heading">{{ workout.name }}</span>
              <pre v-if="workout.notes">{{ workout.notes }}</pre>
            </li>
          </ul>
        </div>
      </template>
      <template v-else>
        <div class="empty-state">
          <span class="error-next">Hit <b>Add a Workout</b> to get started.</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.empty-state
  padding: 1.7rem
  
.workoutList
  padding-left: 0
  margin-top: 0

  li
    list-style-type: none
</style>