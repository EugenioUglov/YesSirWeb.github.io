class FirebaseManager {
    constructor() {

    }



    bindChangeDatabaseValue(handler) {
        const dbRef = firebase.database().ref();

        // On database value changed.
        dbRef.on('value',(snapshot) => {
            const databaseObject = snapshot.val();
            handler(databaseObject);
        });
    }
}