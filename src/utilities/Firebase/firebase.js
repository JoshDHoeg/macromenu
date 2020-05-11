import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

  const config = {
    apiKey: "AIzaSyBdi327ROXTKyAiANCL1lk8fd2sTMfOnt4",
    authDomain: "macro-menu.firebaseapp.com",
    databaseURL: "https://macro-menu.firebaseio.com",
    projectId: "macro-menu",
    storageBucket: "macro-menu.appspot.com",
    messagingSenderId: "1048977791488",
    appId: "1:1048977791488:web:5f1b59ebf2995d9cf656e5",
    measurementId: "G-LCJM79XNMP"
  };

//   const devConfig = {
//     apiKey: process.env.REACT_APP_DEV_API_KEY,
//     authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
//     databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
//     projectId: process.env.REACT_APP_DEV_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
//   };
//   const config =
//     process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

class Firebase {
    constructor() {
      app.initializeApp(config);

      this.serverValue = app.database.ServerValue;
      this.emailAuthProvider = app.auth.EmailAuthProvider;
      this.auth = app.auth();
      this.db = app.database();

      this.googleProvider = new app.auth.GoogleAuthProvider();
      this.facebookProvider = new app.auth.FacebookAuthProvider();
    }

    // *** Auth API ***
    doCreateUserWithEmailAndPassword = (email, password) => 
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) => 
        this.auth.signInWithEmailAndPassword(email, password);

    doSignInWithGoogle = () =>
        this.auth.signInWithPopup(this.googleProvider);
    
    doSignInWithFacebook = () =>
        this.auth.signInWithPopup(this.facebookProvider);

    doSendEmailVerification = () =>
        this.auth.currentUser.sendEmailVerification({
          url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
        });

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password => 
        this.auth.currentUser.updatePassword(password);

    onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              email: authUser.email,
              ...dbUser,
            };
            next(authUser);
          });
      } else {
        fallback();
      }
    });
    

    // *** User API ***
    user = uid => this.db.ref(`users/${uid}`);
  
    users = () => this.db.ref('users');

    // *** Message API ***
    message = uid => this.db.ref(`messages/${uid}`);
  
    messages = () => this.db.ref('messages');

    // *** Project API ***
    project = uid => this.db.ref(`projects/${uid}`);

    projects = () => this.db.ref('projects');
  }
  export default Firebase;