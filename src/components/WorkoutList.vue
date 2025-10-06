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
      <span>Workouts</span>
    </div>
    <div class="hg-list-group">
      <template v-if="sortedWorkoutList.length">
        <div>
          <ul>
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
          <div class="newWorkout" @click="props.router.push('/newworkout')">
            +
          </div>
        </div>
      </template>
      <template v-else>
        <div class="empty-state">No workouts</div>
      </template>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.newWorkout
  position: fixed
  bottom: 3.7rem
  right: 0.7rem
  font-size: 2.3rem
  padding: 0rem 0.5rem
  border-radius: 50%
  color: #42b883
  background-color: #b2dfdb
  text-align: center
  cursor: pointer
  line-height: 2.7rem

  &:hover
    border-color: #999
    color: #333
</style>