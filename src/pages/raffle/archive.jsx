import { useContext, useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/auth";
import { onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { AppContext } from "../../contexts/context";
import { convertDateTime } from "../../utils/functions";
import { NotFound404 } from "../NotFound404";

export const RaffleArchive = () => {
    const navigate = useNavigate();
    const { isAuth } = useAuth();
    const { showAlertMessage } = useContext(AppContext);
    const [raffle, setRaffle] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const removeRaffle = () => {
        const refHistory = doc(db, 'raffles', 'history');
        getDoc(refHistory).then((doc) => {
            if (doc.exists()) {
                const histories = doc.data().histories.filter((history) => history.id !== id);
                updateDoc(refHistory, {
                    histories
                }).then(() => {
                    showAlertMessage('Розіграш видалено')
                    navigate('/raffle/history')
                }).catch(() => showAlertMessage('Помилка видалення розіграшу', 'error'));
            }
        }).catch(() => showAlertMessage('Помилка видалення розіграшу', 'error'));
    }

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'raffles', 'history'), (doc) => {
            if (doc.exists()) {
                const data = doc.data().histories.filter((history) => history.id === id)[0];
                setRaffle(data);
                setLoading(false);
            }
        });
        return () => {
            unSub();
        }
    }, [id]);


    if (!isAuth) {
        return <NotFound404 />
    }

    if (!loading && !raffle) {
        return <Navigate to='/raffle/history' />
    }

    return <>
        {loading &&
            <>
                <div className="draw">
                    <div className="draw__create">
                        <div className="draw__title">
                            <div className="skeleton title"></div>
                            <div className="skeleton input"></div>
                        </div>
                        <div className="draw__preview">
                            <div className="draw__preview-image">
                                <div className="skeleton"></div>
                            </div>
                        </div>
                        <div className="draw__description">
                            <div className="skeleton title"></div>
                            <div className="skeleton" style={{ height: '360px' }}></div>
                        </div>
                        <div className="draw__rewards">
                            <div className="skeleton title mb"></div>
                            <div className="draw__rewards-items">
                                <div className="draw__rewards-item silver skeleton">
                                    <div className="draw__rewards-image">
                                    </div>
                                    <div className="draw__rewards-winner">
                                        <div className="draw__rewards-place">
                                        </div>
                                    </div>
                                    <div className="draw__rewards-reward">
                                        <div className="skeleton input"></div>
                                    </div>
                                </div>
                                <div className="draw__rewards-item gold skeleton">
                                    <div className="draw__rewards-image">
                                    </div>
                                    <div className="draw__rewards-winner">
                                        <div className="draw__rewards-place">
                                        </div>
                                    </div>
                                    <div className="draw__rewards-reward">
                                        <div className="skeleton input"></div>
                                    </div>
                                </div>
                                <div className="draw__rewards-item bronze skeleton">
                                    <div className="draw__rewards-image">
                                    </div>
                                    <div className="draw__rewards-winner">
                                        <div className="draw__rewards-place">
                                        </div>
                                    </div>
                                    <div className="draw__rewards-reward">
                                        <div className="skeleton input"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="draw__end-time">
                            <div className="skeleton title"></div>
                            <div className="skeleton input"></div>
                        </div>
                        <div className="draw__link-live">
                            <div className="skeleton title"></div>
                            <div className="skeleton input"></div>
                        </div>
                        <div className="draw__link-donate">
                            <div className="skeleton title"></div>
                            <div className="skeleton input"></div>
                        </div>
                    </div>
                </div>
            </>
        }
        {!loading &&
            <>
                <div className="draw">
                    <div className="draw__create">
                        <div className="draw__title">
                            <h4 className="title md">Назва розіграшу</h4>
                            <div className="text__wrap tt">
                                <h3>{raffle.title}</h3>
                            </div>
                        </div>
                        <div className="draw__preview">
                            {raffle.preview &&
                                <>
                                    <div className="draw__preview-image">
                                        <img src={raffle.preview instanceof File ? URL.createObjectURL(raffle.preview) : raffle.preview} alt="" />
                                    </div>
                                </>
                            }
                        </div>
                        <div className="draw__description">
                            <h4 className="title md">Опис розіграшу</h4>
                            <div className="text__wrap ds">
                                {raffle.description}
                            </div>
                        </div>
                        <div className="draw__rewards">
                            <h4 className="title md">Призи</h4>
                            <div className="draw__rewards-items">
                                <div className="draw__rewards-item silver">
                                    {raffle.silver.rewardPhoto &&
                                        <>
                                            <div className="draw__rewards-image">
                                                <img src={raffle.silver.rewardPhoto instanceof File ? URL.createObjectURL(raffle.silver.rewardPhoto) : raffle.silver.rewardPhoto} alt="Срібло" />
                                            </div>
                                        </>
                                    }
                                    <div className="draw__rewards-winner">
                                        <div className="draw__rewards-place">
                                            <img src='https://firebasestorage.googleapis.com/v0/b/gans-random.appspot.com/o/icons%2Fsilver.png?alt=media&token=96dc01ae-198b-455f-b2d8-c47f0966c0a6' alt="Срібло" />
                                        </div>
                                        <h3 className="draw__rewards-nickname">{raffle.winners.length > 1 ? raffle.winners[1].nickname : ''}</h3>
                                    </div>
                                    <div className="draw__rewards-reward">
                                        <input
                                            type="text"
                                            className="input fill"
                                            placeholder="2nd"
                                            value={raffle.silver.reward}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="draw__rewards-item gold">
                                    {raffle.gold.rewardPhoto &&
                                        <>
                                            <div className="draw__rewards-image">
                                                <img src={raffle.gold.rewardPhoto instanceof File ? URL.createObjectURL(raffle.gold.rewardPhoto) : raffle.gold.rewardPhoto} alt="Золото" />
                                            </div>
                                        </>
                                    }
                                    <div className="draw__rewards-winner">
                                        <div className="draw__rewards-place">
                                            <img src='https://firebasestorage.googleapis.com/v0/b/gans-random.appspot.com/o/icons%2Fgold.png?alt=media&token=f52d79a1-1df0-4a98-86a2-7d713fc8fc35' alt="Золото" />
                                        </div>
                                        <h3 className="draw__rewards-nickname">{raffle.winners[0].nickname}</h3>
                                    </div>
                                    <div className="draw__rewards-reward">
                                        <input
                                            type="text"
                                            className="input fill"
                                            placeholder="1st"
                                            value={raffle.gold.reward}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="draw__rewards-item bronze">
                                    {raffle.bronze.rewardPhoto &&
                                        <>
                                            <div className="draw__rewards-image">
                                                <img src={raffle.bronze.rewardPhoto instanceof File ? URL.createObjectURL(raffle.bronze.rewardPhoto) : raffle.bronze.rewardPhoto} alt="Бронза" />
                                            </div>
                                        </>
                                    }
                                    <div className="draw__rewards-winner">
                                        <div className="draw__rewards-place">
                                            <img src='https://firebasestorage.googleapis.com/v0/b/gans-random.appspot.com/o/icons%2Fbronze.png?alt=media&token=58be1a6d-6d6b-42af-bce4-79d0e410985c' alt="Бронза" />
                                        </div>
                                        <h3 className="draw__rewards-nickname">{raffle.winners.length > 2 ? raffle.winners[2].nickname : ''}</h3>
                                    </div>

                                    <div className="draw__rewards-reward">
                                        <input
                                            type="text"
                                            className="input fill"
                                            placeholder="3rd"
                                            value={raffle.bronze.reward}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {raffle.winners.length > 3 && <>
                            <div className="draw__members-others">
                                <div className="draw__members-items">
                                    {raffle.winners.map((winner, index) => {
                                        if (index <= 20 && index >= 3) {
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
                        <div className="draw__end-time">
                            <h3 className="title md">День та час закінчення розіграшу</h3>
                            <div className="text__wrap tt"><h3>{convertDateTime(raffle.dateTime)}</h3></div>
                        </div>
                        <div className="draw__link-live">
                            <h3 className="title md">Посилання на ефір</h3>
                            <a href={raffle.live}>
                                <div className="text__wrap tt"><h4>{raffle.live}</h4></div>
                            </a>
                        </div>
                        <div className="draw__link-donate">
                            <h3 className="title md">Посилання на донат</h3>
                            <a href={raffle.donate}>
                                <div className="text__wrap tt"><h4>{raffle.donate}</h4></div>
                            </a>
                        </div>
                        <div className="draw__button">
                            <button className="button pallet-4" onClick={removeRaffle}>Видалити розіграш</button>
                        </div>
                    </div>
                </div>
            </>
        }
    </>
}