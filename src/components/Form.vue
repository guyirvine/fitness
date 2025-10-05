<script setup>
import { defineProps, defineEmits, ref, watch, computed } from "vue";
import { formatDate, formatDateForComparison } from "../utils/dateFormatter";

const props = defineProps({
  initialWorkout: Object,
});
const emit = defineEmits(["add", "update", "cancel", "delete"]);
const newWorkout = ref({ ...props.initialWorkout });
const name = ref(null);

watch(
  () => props.initialWorkout,
  (val) => {
    newWorkout.value = { ...val };
  }
);

const isEditing = computed(() => {
  if (name.value) {
    name.value.focus();
  }
  return newWorkout.value.id !== undefined;
});

const isEditable = ref(newWorkout.value.id === undefined);

function handleSubmit() {
  if (isEditing.value) {
    emit("update", newWorkout.value);
  } else {
    emit("add", newWorkout.value);
  }
}

function handleCancel() {
  emit("cancel");
}

function handleDelete() {
  emit("delete", newWorkout.value);
}
</script>

<template>
  <div class="hg-list-group">
    <div class="panel-actions">
      <button
        v-if="!isEditable"
        @click="isEditable = true"
        title="Edit this workout"
        class="icon-btn"
      >
        <span style="display: flex; align-items: center; gap: 0.2em">
          <!-- Pencil Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="33"
            height="33"
            viewBox="0 0 32 32"
            fill="none"
          >
            <rect
              x="3"
              y="1"
              width="28"
              height="28"
              rx="8"
              fill="none"
              stroke="#43a047"
              stroke-width="2"
            />
            <path
              d="M22 7.29a1 1 0 0 1 1.42 0l1.29 1.29a1 1 0 0 1 0 1.42l-10.17 10.17-3.83.71.71-3.83L22 7.29z"
              fill="#43a047"
            />
            <path
              d="M20.29 8.71l2.83 2.83"
              stroke="#43a047"
              stroke-width="1.2"
              stroke-linecap="round"
            />
          </svg>
        </span>
      </button>
      <button
        v-if="isEditable && isEditing"
        @click="handleDelete()"
        title="Delete workout"
        class="icon-btn"
      >
        <span style="display: flex; align-items: center; gap: 0.2em">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="33"
            height="33"
            viewBox="0 0 32 32"
            fill="none"
          >
            <!-- Rectangle with rounded corners -->
            <rect
              x="2"
              y="2"
              width="28"
              height="28"
              rx="8"
              fill="none"
              stroke="#43a047"
              stroke-width="2"
            />
            <!-- Trash Icon -->
            <g
              stroke="#43a047"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="7 10 25 10" />
              <path
                d="M23 10v10a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V10m3 0V8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
              />
              <line x1="14" y1="14" x2="14" y2="20" />
              <line x1="18" y1="14" x2="18" y2="20" />
            </g>
          </svg>
        </span>
      </button>
    </div>

    <form @submit.prevent="handleSubmit">
      <p>
        <label>Name</label>
        <input
          v-if="isEditable"
          ref="name"
          v-model="newWorkout.name"
          required
        />
        <span v-if="!isEditable" class="fieldValue">{{ newWorkout.name }}</span>
      </p>
      <p>
        <label>Notes</label>
        <textarea
          v-if="isEditable"
          v-model="newWorkout.notes"
          placeholder="Notes"
        ></textarea>
        <span v-if="!isEditable" class="fieldValue">{{
          newWorkout.notes
        }}</span>
      </p>
      <p v-if="isEditable">
        <button type="submit">
          {{ isEditing ? "Update" : "Add" }} Workout
        </button>
      </p>
    </form>
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