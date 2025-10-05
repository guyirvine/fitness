import { createRouter, createWebHashHistory } from 'vue-router';
import Fitness from './components/Fitness.vue';
import Form from './components/Form.vue';
import SessionList from './components/SessionList.vue';
import WorkoutList from './components/WorkoutList.vue';


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
        path: 'session',
        name: 'session',
        component: SessionList
      },
      {
        path: 'workout',
        name: 'workout',
        component: WorkoutList
      },
      {
        path: 'form',
        name: 'form',
        // This will be handled in Fitness as a modal or subview
        // You may want to use a dedicated form component here
        component: Form || Fitness
      },
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
