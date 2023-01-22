import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDNF32XqyJFCbauA-g38lcqXT440ESyTSI",
  authDomain: "keeker-51f52.firebaseapp.com",
  databaseURL: "https://keeker-51f52-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "keeker-51f52",
  storageBucket: "keeker-51f52.appspot.com",
  messagingSenderId: "835284069795",
  appId: "1:835284069795:web:41eafb0f37a3871c1d3e16"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


export const getRankingList = company => {
    return db.collection("user").where("group", "==", company).get();
};


export const getGroupList = company => {
    return db.collection("group").orderBy("name", "asc").get();
};


export const addMatch = (userNameArrayLosers, userNameArrayWinners, group) => {
    userNameArrayLosers = userNameArrayLosers.split(',');
    userNameArrayWinners = userNameArrayWinners.split(',');
    return db.collection('match')
        .add({
            "data": new Date(),
            "losers": userNameArrayLosers,
            "winners": userNameArrayWinners,
            "group": group
        });
};

export const createGroup = (groupName, groupSecret) => {
    return db.collection('group')
        .add({
            "name": groupName,
            "password": groupSecret
        });
};


export const getMatchList = company => {
    return db.collection("match")
        .where("group", "==", company).get();
};

export const getGroupPass = (groupName) => {
    return db.collection('group').where("name", "==", groupName).get();
};

