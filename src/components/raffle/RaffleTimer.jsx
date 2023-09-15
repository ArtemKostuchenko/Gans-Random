import { useEffect, useState } from "react"
import { getEndTime } from "../../utils/functions"
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useAuth } from "../../hooks/auth";
import { randomizeWinners } from '../../utils/random'


export const RaffleTimer = ({ title, image, duration, setTimer }) => {
    const [timeEnd, setTimeEnd] = useState(getEndTime(duration));
    const [timeLeft, setTimeLeft] = useState(duration - 1)
    const { isAuth } = useAuth();

    const cancelRaffleEnd = () => {
        const refDB = doc(db, 'raffles', 'raffle');
        updateDoc(refDB, {
            startTime: false,
            raffleTime: '',
        }).then(() => {
            setTimer(false);
        }).catch((err) => console.error(err));
    }

    const finishRaffle = () => {
        if (isAuth) {
            const refDB = doc(db, 'raffles', 'members');
            getDoc(refDB).then((snapshot) => {
                if (snapshot.exists()) {
                    const members = snapshot.data().members;
                    if (Boolean(members.length)) {
                        const winners = randomizeWinners(members);
                        const refRaffle = doc(db, 'raffles', 'raffle');
                        updateDoc(refRaffle, {
                            winners: winners,
                            startTime: false,
                        }).then(() => {
                            setTimer(false);
                        }).catch((err) => console.error(err));
                    }
                }
            }).catch((err) => console.error(err));
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date();
            const timeLeftInSeconds = Math.max(0, Math.floor((timeEnd - currentTime) / 1000));
            setTimeLeft(timeLeftInSeconds);
            if (timeLeftInSeconds === 0) {
                clearInterval(interval);
                finishRaffle()
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [timeEnd]);

    useEffect(() => {
        if (isAuth) {
            const refDB = doc(db, 'raffles', 'raffle');
            updateDoc(refDB, {
                startTime: true,
            }).then(() => { }).catch((err) => console.error(err));
            window.addEventListener('beforeunload', cancelRaffleEnd);
        }
    }, []);


    return <>
        <div className="random">
            <div className="random__content">
                <div className="random__info">
                    <h3 className="random__title">{title}</h3>
                    <div className="random__image">
                        <img src={image} alt={title} />
                    </div>
                </div>
                <div className="random__timer">
                    <h4 className="random__timer-title">Переможці будуть визначені через</h4>
                    <span className="random__timer-time">{timeLeft} с</span>
                </div>
                {isAuth &&
                    <>
                        <div className="random__cancel">
                            <button className="button pallet-4" onClick={cancelRaffleEnd}>Скасувати</button>
                        </div>
                    </>
                }
            </div>
        </div>
    </>
}