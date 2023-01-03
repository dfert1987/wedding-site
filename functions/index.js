const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send('Hello wedding guests');
});

exports.getComments = functions.https.onRequest((req, res) => {
    admin
        .firestore()
        .collection('comments')
        .get()
        .then((data) => {
            let comments = [];
            data.forEach((doc) => {
                comments.push(doc.data());
            });
            return res.json(comments);
        })
        .catch((err) => console.error(err));
});

exports.createComment = functions.https.onRequest((req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: 'Method not allowed.' });
    }
    const newComment = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };

    admin
        .firestore()
        .collection('comments')
        .add(newComment)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err);
        });
});
