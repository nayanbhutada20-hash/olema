const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

class FireBaseAuth {


    async  firebaseCreateuser(email,password) {

        try {
            const userRecord = await admin.auth().createUser({
                email,
                password,
            });


            return {
                success: true,
                message: 'User registered successfully',
                uid: userRecord.uid
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports=new FireBaseAuth();