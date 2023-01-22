import {collection, doc, getDocs, getFirestore} from 'firebase/firestore/lite';
import {initializeApp} from 'firebase/app';

require('dotenv').config();

const firebaseConfig = {
        projectId: "keeker-51f52"
    },

    app = initializeApp(firebaseConfig),
    db = getFirestore(app);

const handler = async (event) => {
    if (event.httpMethod === 'GET') {
        try {
            const matches = await getDocs(collection(db, 'match')),
                groupMatches = doc => !event.queryStringParameters.group || event.queryStringParameters.group == doc.data().group,
                matchesList = matches.docs
                .filter(groupMatches)
                .map(doc => doc.data())
                .sort((a,b) => a.data.seconds - b.data.seconds);
            return {
                statusCode: 200,
                body: JSON.stringify(matchesList),
            }
        } catch (error) {
            return {statusCode: 500, body: error.toString()}
        }
    }
}

export {handler};
