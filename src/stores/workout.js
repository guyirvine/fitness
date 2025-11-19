import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid';

import { firebaseConfig } from '../firebaseConfig.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

export const useWorkoutStore = defineStore('workout', () => {
  const workoutList = ref([])
  const workoutList2 = ref([])


//  const app = initializeApp(firebaseConfig);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Get a list of cities from your database
  async function getWorkouts() {
    const workoutCol = collection(db, 'workoutList');
    const workoutSnapshot = await getDocs(workoutCol);
    const w = await workoutSnapshot.docs.map(doc => doc.data());
    workoutList2.value = w;
    console.log('getWorkouts. w: ', w, 'workoutList2.value: ', workoutList2.value);
  }

  async function loadWorkoutsFromAPI() {
    getWorkouts();
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
    workoutList2,
    loadWorkoutsFromAPI,
    updateWorkoutInAPI,
    deleteWorkoutFromAPI,
    saveWorkoutToAPI,
  }
})
