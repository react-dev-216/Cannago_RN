import * as firebase from 'firebase';
var Firebase = "";

// const firebaseConfig = {
//     apiKey: "AIzaSyD_ucvCCPGSOdhMbew-UE4uyaFx56aklvg",
//     authDomain: "cannago-23721.firebaseapp.com",
//     databaseURL: "https://cannago-23721-default-rtdb.firebaseio.com",
//     projectId: "cannago-23721",
//     storageBucket: "cannago-23721.appspot.com",
//     messagingSenderId: "705433366225",
//     appId: "1:705433366225:web:19f6b8db84b9cf0d60dff0",
//     measurementId: "G-Z04Z1C5JP7"
// };
const firebaseConfig = {
    apiKey: "AIzaSyClgLqsbIAEqHMlwIxvtdps6VHjY3d4d20",
    authDomain: "cannago-39ac6.firebaseapp.com",
    databaseURL: "https://cannago-39ac6-default-rtdb.firebaseio.com",
    projectId: "cannago-39ac6",
    storageBucket: "cannago-39ac6.appspot.com",
    messagingSenderId: "1070817860843",
    appId: "1:1070817860843:web:dbaf9def8d2fa40b18f2ae",
    measurementId: "G-F8PEE86L9W"
  };
if (!firebase.apps.length) {
    Firebase = firebase.initializeApp(firebaseConfig);
}

export default Firebase;