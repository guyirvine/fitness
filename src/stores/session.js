import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid';

export const useSessionStore = defineStore('session', () => {
  const sessionList = ref([])

  async function loadSessionsFromAPI() {
    if (!localStorage.sessionList) {
      sessionList.value = [];
    } else {
      sessionList.value = JSON.parse(localStorage.sessionList);
    }
  }

  async function saveSessionToAPI(session) {
    const newSession = { ...session, id: uuidv4() };
    sessionList.value.push(newSession);
    localStorage.sessionList = JSON.stringify(sessionList.value);

    session.id = newSession.id; // Assign the generated ID to the session
  }

  async function updateSessionInAPI(session) {
    const idx = sessionList.value.findIndex(
      (w) => w.id === session.id
    );
    if (idx >= 0) {
      sessionList.value[idx] = { ...session };
    }
    localStorage.sessionList = JSON.stringify(sessionList.value);
  }

  async function deleteSessionFromAPI(session) {
    const idx = sessionList.value.findIndex((p) => p.id === session.id);
    if (idx < 0) return;

    sessionList.value.splice(idx, 1);
    localStorage.sessionList = JSON.stringify(sessionList.value);
  }

  return {
    sessionList,
    loadSessionsFromAPI,
    updateSessionInAPI,
    deleteSessionFromAPI,
    saveSessionToAPI,
  }
})
