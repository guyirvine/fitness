<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useWorkoutStore } from "../stores/workout";
import { useSessionStore } from "../stores/session";

const workoutStore = useWorkoutStore();
const sessionStore = useSessionStore();
const router = useRouter();

onMounted(() => {
  workoutStore.loadWorkoutsFromAPI();
  sessionStore.loadSessionsFromAPI();
});

</script>

<template>
  <div class="fitness">
    <router-view v-slot="{ Component }" :router="router">
      <component :is="Component" v-bind="{ router: router }" />
    </router-view>
  </div>
    <nav class="tab-bar">
    </nav>
</template>

<style lang="sass">
.empty-state
  display: flex
  flex-direction: column
  gap: 1rem

  .error-name, .error-next
  display: flex

.tab-bar
  width: 500px
  display: flex
  justify-content: center
  padding-bottom: 0.3rem
  position: sticky
  bottom: 0
  z-index: 1000
  background-color: #FCFCFC
  height: 2.5rem
  border-top: 1px solid #42B883

  ul
    display: flex
    gap: 0.5rem
    list-style: none
    margin: 0
    padding: 0

    li
      margin: 0

      a
        display: flex
        align-items: center
        justify-content: center
        border: none
        border-top: 3px solid transparent
        padding: 0.5rem 1.5rem
        font-size: 1rem
        font-weight: 500
        color: #333
        cursor: pointer
        border-radius: 0
        background: transparent
        text-decoration: none

        &.active
          border-top: 3px solid #42b883
          color: #42b883

      .plus-link
        padding: 0.5rem 1.1rem

        .plus-icon
          display: flex
          align-items: center
          justify-content: center
          width: 28px
          height: 28px
          background: #fff
          border-radius: 8px
          box-shadow: 0 1px 4px #0001
          transition: background 0.2s

        &.active .plus-icon,
        &:hover .plus-icon
          background: #e0f7ef
          border-color: #42b883
</style>

<style lang="sass">
@import url("https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap")

.fitness
  width: 500px
  padding: 0
  background: white
  border-radius: 8px
  box-shadow: 0 2px 8px #0001
  font-family: "Google Sans", Arial, sans-serif

  a.delete
    color: red

  .title
    display: flex
    padding-bottom: 0.7rem
    padding-top: 0.7rem
    padding-left: 1rem
    border-bottom: 1px solid #42b883
    color: #388e3c

    span
      font-weight: 100
      font-size: 1.3rem

    .action
      padding-top: 0.1rem
      margin-right: 0.7rem

    a.action
      font-weight: bold
      color: #388e3c

    input
      width: 60%
      padding: 0.3rem
      margin-top: 0.1rem

      &:focus
        border-color: #42b883

  .app-box
    padding-bottom: 1rem
</style>

<style lang="sass">
.hg-list-group
  position: relative
  margin-top: 0
  padding: 1rem
  padding-top: 0.7rem
  padding-bottom: 4rem

  .hg-list-date-group
    padding-top: 0.5rem
    margin: 0

    & .heading
      margin-top: 0
      font-weight: bold
      /* color: #1976d2 */
      color: #388e3c
      display: block
</style>

<style lang="sass" scoped>
@media (max-width: 400px)
  /* Mobile-specific styles */

  .fitness
    width: 100%

    .title

      span
        font-size: 1.1rem

      input
        width: 50%

  .tab-bar
    width: 100%
    position: fixed
    padding-bottom: 0

    ul
      width: 100%
      li
        width: 50%
        a
          padding: 0.7rem
        a.plus-link
          padding: 0.7rem
</style>

<style lang="sass">
pre
  text-wrap: auto
  border: 1px solid #ccc
  background: #f8f8f8
  margin-top: 0.3rem
  margin-bottom: 0.3rem
  padding: 0.7rem
  overflow-x: auto

form
  display: flex
  flex-direction: column
  gap: 0.5rem

  p
    margin: 0
    padding: 0.5rem
    padding-left: 0
    padding-right: 0

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
