<script setup>
import { defineProps, computed } from "vue";
import { formatDate } from "../utils/dateFormatter";

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

const sortedWorkoutList = computed(() => {
  props.workoutList.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  return props.workoutList;
});
</script>

<template>
  <div class="hg-list-group">
    <template v-if="sortedWorkoutList.length">
      <div>
        <ul>
          <li
            v-for="workout in sortedWorkoutList"
            :key="workout.id"
            class="hg-list-date-group"
            @click="onEdit(workout)"
          >
            <span class="heading">{{ workout.name }}</span>
            <pre v-if="workout.notes">{{ workout.notes }}</pre>
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <div class="empty-state">No workouts</div>
    </template>
  </div>
</template>
