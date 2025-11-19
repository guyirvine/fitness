import { createRouter, createWebHashHistory } from 'vue-router';
import Fitness from './components/Fitness.vue';
import SessionList from './components/SessionList.vue';
import EditSession from './components/EditSession.vue';
import WorkoutList from './components/WorkoutList.vue';
import NewWorkout from './components/NewWorkout.vue';
import EditWorkout from './components/EditWorkout.vue';
import Auth from './components/Auth.vue';

const routes = [
  {
    path: '/',
    component: Fitness,
    children: [
      {
        path: '',
        redirect: 'session'
      },
      {
        path: '/session/:id',
        name: 'editsession',
        component: EditSession,
        props: true
      },
      {
        path: 'auth',
        name: 'auth',
        component: Auth
      },
      {
        path: 'session',
        name: 'session',
        component: SessionList
      },
      {
        path: '/workout/:id',
        name: 'editworkout',
        component: EditWorkout,
        props: true
      },
      {
        path: 'workout',
        name: 'workout',
        component: WorkoutList
      },
      {
        path: 'newworkout',
        name: 'newworkout',
        // This will be handled in Fitness as a modal or subview
        // You may want to use a dedicated form component here
        component: NewWorkout || Fitness
      },
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
