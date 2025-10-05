import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid';

export const useWorkoutStore = defineStore('workout', () => {
  const workoutList = ref([])

  async function loadWorkoutsFromAPI() {
    if (!localStorage.workoutList) {
      workoutList.value = [];
    } else {
      workoutList.value = JSON.parse(localStorage.workoutList);
    }
  }

  async function saveWorkoutToAPI(workout) {
    const newWorkout = { ...workout, id: uuidv4() };
    workoutList.value.push(newWorkout);
    localStorage.workoutList = JSON.stringify(workoutList.value);

    workout.id = newWorkout.id; // Assign the generated ID to the workout
  }

  async function updateWorkoutInAPI(workout) {
    localStorage.workoutList = JSON.stringify(workoutList.value);
  }

  async function deleteWorkoutFromAPI(workout) {
    const idx = workoutList.value.findIndex((p) => p.id === workout.id);
    if (idx < 0) return;

    workoutList.value.splice(idx, 1);
    localStorage.workoutList = JSON.stringify(workoutList.value);
  }

  return {
    workoutList,
    loadWorkoutsFromAPI,
    updateWorkoutInAPI,
    deleteWorkoutFromAPI,
    saveWorkoutToAPI,
  }
})
