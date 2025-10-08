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