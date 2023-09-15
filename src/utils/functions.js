import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../utils/firebase";
import { storage } from "../utils/firebase";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";


export const convertDateTime = (inputDateTime) => {
    var dateTimeComponents = inputDateTime.split("T");
    var dateComponents = dateTimeComponents[0].split("-");
    var timeComponents = dateTimeComponents[1].split(":");
    var monthNames = [
        "січня", "лютого", "березня", "квітня", "травня", "червня",
        "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ];

    var formattedDateTime = dateComponents[2] + "." + dateComponents[1] + "." + dateComponents[0] + " " +
        timeComponents[0] + ":" + timeComponents[1] + ":00";

    return formattedDateTime;
}

export const getEndTime = (duration) => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + Number(duration))
    return date;
}


export const uploadImageAndReturnUrl = async (image) => {
    if (image instanceof File) {
        try {
            return await uploadRaffleImage(image);
        } catch (error) {
            throw new Error('Невдалося завантажити зображення');
        }
    }
    return image;
};

export const uploadRaffleImage = (image) => {
    return new Promise((resolve, reject) => {
        const reference = ref(storage, `images/${Date.now()}_images`);
        uploadBytes(reference, image)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((url) => {
                        resolve(url);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export const saveRaffle = (raffle, preview_url, silver_url = '', gold_url = '', bronze_url = '') => {
    return new Promise((resolve, reject) => {
        const refDB = doc(db, 'raffles', 'raffle');
        setDoc(refDB, {
            id: uuidv4(),
            title: raffle.title,
            preview: preview_url,
            description: raffle.description,
            silver: { ...raffle.silver, rewardPhoto: silver_url },
            gold: { ...raffle.gold, rewardPhoto: gold_url },
            bronze: { ...raffle.bronze, rewardPhoto: bronze_url },
            dateTime: raffle.dateTime,
            live: raffle.live,
            donate: raffle.donate,
            finished: false,
            startTime: false,
            raffleTime: '',
            winners: [],
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
}
