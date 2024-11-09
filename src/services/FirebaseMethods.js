

import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import { isIOS, showFlash } from '../utils/MyUtils'
import { FIREBASE_COLLECTIONS, PAYMENT_UTILS } from '../enums/AppEnums'
import { En } from '../locales/En'
import { paymentApis } from '../apis/PaymentApi'


export async function saveData(collection, doc, jsonObject, merge = true) {
    await firestore()
        .collection(collection)
        .doc(doc)
        .set(jsonObject, { merge })
        .catch(function (error) {
            console.error('Error writing document: ', error)
        })
    console.log('Document successfully written!')
}

export const addDocument = async (collection, jsonObject) => {
    const docRef = firestore().collection(collection).doc()
    jsonObject.documentId = docRef.id
    jsonObject.createdAt = firestore.FieldValue.serverTimestamp(),
        await docRef
            .set(jsonObject, { merge: true })
            .catch(function (error) {
                console.error('Error writing document: ', error)
            })
    // console.log('Document successfully written!')
}

export const getDocumentData = async (collection, doc) => {
    let found = {}
    await firestore()
        .collection(collection)
        .doc(doc)
        .get()
        .then((doc) => {
            if (doc.exists) {
                found = { ...doc.data() }
            }
        })
    return found
}

export const getCollectionData = async (collection) => {
    let data = []
    let querySnapshot = await firestore()
        .collection(collection)
        .orderBy('createdAt', 'asc')
        .get()
    querySnapshot.forEach(function (doc) {
        if (doc?.exists) {
            data.push({ ...doc.data() })
        } else {
            console.log('No document found!')
        }
    })
    return data
}

export async function getAllOfCollectionWhere(collection, key, id) {
    let data = []
    let querySnapshot = await firestore()
        .collection(collection)
        .where(key, '==', id)
        .get()
    querySnapshot.forEach(function (doc) {
        if (doc.exists) {
            data.push({ ...doc.data(), doc_id: doc?.id })
        } else {
            console.log('No document found!')
        }
    })
    return data
}

export async function getAllOfCollectionWhereByOrder(collection, key, id) {
    let data = []
    let querySnapshot = await firestore()
        .collection(collection)
        .where(key, '==', id)
        .orderBy('createdAt', 'desc')
        .get()
    querySnapshot.forEach(function (doc) {
        if (doc.exists) {
            data.push({ ...doc.data(), doc_id: doc?.id })
        } else {
            console.log('No document found!')
        }
    })
    return data
}

export async function getAllOfCollectiondoublewhere(
    collection,
    key,
    id,
    key1,
    id1,
) {
    let data = []
    let querySnapshot = await firestore()
        .collection(collection)
        .where(key, '==', id)
        .where(key1, '==', id1)
        .get()
    querySnapshot.forEach(function (doc) {
        if (doc.exists) {
            data.push(doc.data())
        } else {
            console.log('No document found!')
        }
    })
    return data
}

export const uploadImage = async (folder, path) => {
    const uri = path
    const filename = uri.substring(uri.lastIndexOf('/') + 1)
    const uploadUri = isIOS() ? uri.replace('file://', '') : uri

    const task = storage().ref(`${folder}/${filename}`).putFile(uploadUri)

    try {
        await task
        const url = await storage().ref(`${folder}/${filename}`).getDownloadURL()
        return { url, filename };
    } catch (e) {
        console.error(e)
        return 'false'
    }
}

export async function Delete(collection, doc) {
    await firestore().collection(collection).doc(doc).delete()
}


export const signUp = async (name, email, password, gender, accType,url,filename) => {
    try {
        // Create a new user with email and password
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);

        // Get user information
        const user = userCredential.user;

        const apiData = {
            email:email,
            name:name
        }

        const stripeCustomer = await paymentApis(PAYMENT_UTILS.NEW_CUSTOMER,apiData)

        if(!stripeCustomer || !stripeCustomer.data.id){
            showFlash("Something went wrong!. Try again later")
            return;
        }

        const userData = {
            uid: user.uid,
            email: email,
            name: name,
            gender: gender,
            accType: accType,
            profileImage:{
                url:url,
                filename:filename
            },
            createdAt: firestore.FieldValue.serverTimestamp(),
            stripeId:stripeCustomer?.data?.id
        };



        // Store user data in a specific collection (e.g., "users")
        await firestore().collection(FIREBASE_COLLECTIONS.USERS).doc(user.uid).set(userData);

        // console.log('User account created & signed in!');
        return true; // Return user data if needed
    } catch (error) {
        // console.error('Error signing up: ', error);
        throw error; // You can throw or handle the error as needed
    }
};

export const login = async (email, password) => {
    try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const userData = userCredential.user;
    
        const userDoc = await getDocumentData(FIREBASE_COLLECTIONS.USERS, userData?.uid);
        if (userDoc) {
            const userInfo = userDoc;
            return userInfo;
        } else {
            throw new Error(En.userNotFound); // User document not found
        }
    } catch (error) {

        switch (error.code) {
            case 'auth/user-not-found':
                throw new Error(En.emailDoesNotExist);
            case 'auth/wrong-password':
                throw new Error(En.enterCorrectEmailPassword);
            case 'auth/invalid-email':
                throw new Error(En.invalidEmail);
            case 'auth/user-disabled':
                throw new Error(En.accountDisabled);
            case 'auth/invalid-credential':
                throw new Error(En.invalidCredential);
            default:
                console.error("Unexpected error:", error);
                throw new Error(En.somethingWentWrong);
        }
    }
};

export const signOut = async () => {
    await auth().signOut()
}

export const deleteImage = async (folder, filename) => {
    const imageRef = storage().ref(`${folder}/${filename}`);
    try {
        await imageRef.delete();
        return true;
    } catch (e) {
        console.error(`Error deleting image: ${e}`);
        return false;
    }
};
