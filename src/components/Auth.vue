<template>
<div class="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <!-- Header section containing title -->
      <header
        class="mdl-layout__header mdl-color-text--white mdl-color--light-blue-700"
      >
        <div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
          <div
            class="mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--8-col-desktop"
          >
            <a href="/"><h3>Firebase Authentication</h3></a>
          </div>
        </div>
      </header>

      <main class="mdl-layout__content mdl-color--grey-100">
        <div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
          <!-- Container for the demo -->
          <div
            class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop"
          >
            <div
              class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white"
            >
              <h2 class="mdl-card__title-text">
                Firebase Email &amp; Password Authentication
              </h2>
            </div>
            <div class="mdl-card__supporting-text mdl-color-text--grey-600">
              <p>
                Enter an email and password below and either sign in to an
                existing account or sign up
              </p>

              <input
                v-model="emailInput"
                class="mdl-textfield__input"
                style="display: inline; width: auto"
                type="text"
                id="email"
                name="email"
                placeholder="Email"
              />
              &nbsp;&nbsp;&nbsp;
              <input
                v-model="passwordInput"
                class="mdl-textfield__input"
                style="display: inline; width: auto"
                type="password"
                id="password"
                name="password"
                placeholder="Password"
              />
              <br /><br />
              <button
                class="mdl-button mdl-js-button mdl-button--raised"
                id="quickstart-sign-in"
                name="signin"
                @click.prevent="toggleSignIn()"
              >
                Sign In
              </button>
              &nbsp;&nbsp;&nbsp;
              <button
                class="mdl-button mdl-js-button mdl-button--raised"
                id="quickstart-sign-up"
                name="signup"
                @click="handleSignUp()"
              >
                Sign Up
              </button>
              &nbsp;&nbsp;&nbsp;
              <button
                class="mdl-button mdl-js-button mdl-button--raised"
                disabled
                id="quickstart-verify-email"
                name="verify-email"
              >
                Send Email Verification
              </button>
              &nbsp;&nbsp;&nbsp;
              <button
                class="mdl-button mdl-js-button mdl-button--raised"
                id="quickstart-password-reset"
                name="verify-email"
              >
                Send Password Reset Email
              </button>

              <!-- Container where we'll display the user details -->
              <div class="quickstart-user-details-container">
                Firebase sign-in status:
                <span id="quickstart-sign-in-status">{{ signInStatus }}</span>
                <div>Firebase auth <code>currentUser</code> object value:</div>
                <pre><code id="quickstart-account-details">null</code></pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { firebaseConfig } from '../firebaseConfig';

const emailInput = ref("guyirvine@gmail.com");
const passwordInput = ref("password");
const signInStatus = ref("Unknown");

initializeApp(firebaseConfig);

const auth = getAuth();

//if (window.location.hostname === 'localhost') {
//  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
//}

/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  console.log("toggleSignIn.1")
  if (auth.currentUser) {
    signOut(auth);
  } else {
    const email = emailInput.value;
    const password = passwordInput.value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    signInWithEmailAndPassword(auth, email, password).catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
//      signInButton.disabled = false;
    });
  }
//  signInButton.disabled = true;
}

/**
 * Handles the sign up button press.
 */
function handleSignUp() {
  const email = emailInput.value;
  const password = passwordInput.value;
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  // Create user with email and pass.
  createUserWithEmailAndPassword(auth, email, password).catch(function (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  });
}


onMounted(() => {
//const emailInput = document.getElementById('email');
//const passwordInput = document.getElementById('password');
const signInButton = document.getElementById(
  'quickstart-sign-in',
);
const signUpButton = document.getElementById(
  'quickstart-sign-up',
);
const passwordResetButton = document.getElementById(
  'quickstart-password-reset',
);
const verifyEmailButton = document.getElementById(
  'quickstart-verify-email',
);
//const signInStatus = document.getElementById(
//  'quickstart-sign-in-status',
//);
const accountDetails = document.getElementById(
  'quickstart-account-details',
);


/**
 * Sends an email verification to the user.
 */
function sendVerificationEmailToUser() {
  sendEmailVerification(auth.currentUser).then(function () {
    // Email Verification sent!
    alert('Email Verification Sent!');
  });
}

function sendPasswordReset() {
  const email = emailInput.value;
  sendPasswordResetEmail(auth, email)
    .then(function () {
      // Password Reset Email Sent!
      alert('Password Reset Email Sent!');
    })
    .catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/invalid-email') {
        alert(errorMessage);
      } else if (errorCode == 'auth/user-not-found') {
        alert(errorMessage);
      }
      console.log(error);
    });
}

// Listening for auth state changes.
onAuthStateChanged(auth, function (user) {
console.log('onAuthStateChanged: ', user);
  verifyEmailButton.disabled = true;
  if (user) {
    // User is signed in.
    const displayName = user.displayName;
    const email = user.email;
    const emailVerified = user.emailVerified;
    const photoURL = user.photoURL;
    const isAnonymous = user.isAnonymous;
    const uid = user.uid;
    const providerData = user.providerData;
    signInStatus.value = 'Signed in';
    signInButton.textContent = 'Sign out';
    accountDetails.textContent = JSON.stringify(user, null, '  ');
    if (!emailVerified) {
      verifyEmailButton.disabled = false;
    }
  } else {
    // User is signed out.
    signInStatus.value = 'Signed out';
    signInButton.textContent = 'Sign in';
    accountDetails.textContent = 'null';
  }
  signInButton.disabled = false;
});

//signInButton.addEventListener('click', toggleSignIn, false);
//signUpButton.addEventListener('click', handleSignUp, false);
verifyEmailButton.addEventListener('click', sendVerificationEmailToUser, false);
passwordResetButton.addEventListener('click', sendPasswordReset, false);
});
</script>
    