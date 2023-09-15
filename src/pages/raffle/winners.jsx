import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth"
import { Link } from "react-router-dom";
import { AppContext } from "../../contexts/context";
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

export const RafflesWinners = () => {
    const { isAuth } = useAuth();
    const [raffle, setRaffle] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showAlertMessage } = useContext(AppContext);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'raffles', 'raffle'), (doc) => {
            setRaffle(doc.data());
            setLoading(false);
        });
        return () => {
            unSub();
        }
    }, []);

    const closeRaffle = async () => {
        if (!isAuth) {
            return;
        }

        const refDB = doc(db, 'raffles', 'history');

        try {
            const snapshot = await getDoc(refDB);
            const histories = snapshot.exists() ? [...snapshot.data().histories, raffle] : [raffle];

            await setDoc(refDB, { histories });

            await Promise.all([
                deleteDoc(doc(db, 'raffles', 'members')),
                deleteDoc(doc(db, 'raffles', 'raffle')),
            ]);

            showAlertMessage('Розіграш закрито');
        } catch (error) {
            showAlertMessage('Помилка закриття розіграшу', 'error');
        }
    };

    return <>
        {loading &&
            <>
                <div className="draw">
                    <div className="draw__members">
                        <div className="draw__title center">
                            <div className="skeleton title bbg"></div>
                        </div>
                        <div className="draw__preview">
                            <div className="draw__preview-image">
                                <div className="skeleton"></div>
                            </div>
                        </div>
                        <div className="draw__rewards">
                            <h4 className="skeleton title md mb ">Призи</h4>
                            <div className="draw__rewards-items client">
                                <div className="draw__rewards-item silver client skeleton">
                                </div>
                                <div className="draw__rewards-item gold client skeleton"></div>
                                <div className="draw__rewards-item bronze client skeleton"></div>
                            </div>
                        </div>
                        <div className="draw__members-others">
                            <div className="draw__members-items">
                                {Array.from({ length: 10 }).map((val, index) => {
                                    return (
                                        <div className="draw__members-item skeleton bbg" key={index}></div>
                                    )
                                })}

                            </div>
                        </div>
                        {isAuth &&
                            <>
                                <div className="draw__button">

                                    <button className="button pallet-4">Закрити розіграш</button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </>
        }
        {!loading &&
            <>
                <div className="draw">
                    <div className="draw__members">
                        <div className="draw__title center">
                            <Link to='/raffle'>
                                <h4 className="title bg">{raffle.title}</h4>
                            </Link>
                        </div>
                        <div className="draw__preview">
                            <Link to='/raffle'>
                                <div className="draw__preview-image">
                                    <img src={raffle.preview} alt={raffle.title} />
                                </div>
                            </Link>
                        </div>
                        <div className="draw__rewards">
                            <h4 className="title md">Призи</h4>
                            <div className="draw__rewards-items client">
                                <div className="draw__rewards-item silver client">
                                    <div className="draw__rewards-image">
                                        <img src={raffle.silver.rewardPhoto} alt={raffle.silver.reward} />
                                    </div>
                                    <div className="draw__rewards-winner">
                                        <div className="draw__rewards-place">
                                            <img src='https://firebasestorage.googleapis.com/v0/b/gans-random.appspot.com/o/icons%2Fsilver.png?alt=media&token=96dc01ae-198b-455f-b2d8-c47f0966c0a6' alt="Срібло" />
                                        </div>
                                        <h3 className="draw__rewards-nickname">{raffle.winners.length > 1 ? raffle.winners[1].nickname : ''}</h3>
                                    </div>
                                </div>
                                <div className="draw__rewards-item gold client">
                                    <div className="draw__rewards-image">
                                        <img src={raffle.gold.rewardPhoto} alt={raffle.gold.reward} />
                                    </div>
                                    <div className="draw__rewards-winner">
                                        <div className="draw__rewards-place">
                                            <img src='https://firebasestorage.googleapis.com/v0/b/gans-random.appspot.com/o/icons%2Fgold.png?alt=media&token=f52d79a1-1df0-4a98-86a2-7d713fc8fc35' alt="Золото" />
                                        </div>
                                        <h3 className="draw__rewards-nickname">{raffle.winners[0].nickname}</h3>
                                    </div>
                                </div>
                                <div className="draw__rewards-item bronze client">
                                    <div className="draw__rewards-image">
                                        <img src={raffle.bronze.rewardPhoto} alt={raffle.bronze.reward} />
                                    </div>
                                    <div className="draw__rewards-winner">
                                        <div className="draw__rewards-place">
                                            <img src='https://firebasestorage.googleapis.com/v0/b/gans-random.appspot.com/o/icons%2Fbronze.png?alt=media&token=58be1a6d-6d6b-42af-bce4-79d0e410985c' alt="Бронза" />
                                        </div>
                                        <h3 className="draw__rewards-nickname">{raffle.winners.length > 2 ? raffle.winners[2].nickname : ''}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {raffle.winners.length > 3 && <>
                            <div className="draw__members-others">
                                <div className="draw__members-items">
                                    {raffle.winners.map((winner, index) => {
                                        if (index <= 20 && index >=3) {
                                            return (
                                                <div className="draw__members-item">
                                                    <div className="draw__members-counter">{index + 1}.</div>
                                                    <h3 className="draw__members-nickname text__wrap">{winner.nickname}</h3>
                                                </div>
                                            )
                                        }else{
                                            return <></>
                                        }
                                    })}
                                </div>
                            </div>
                        </>}
                        {isAuth &&
                            <>
                                <div className="draw__button">
                                    <button className="button pallet-4" onClick={closeRaffle}>Закрити розіграш</button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </>
        }
    </>
}