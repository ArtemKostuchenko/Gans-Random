import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { convertDateTime } from "../../utils/functions";
import { NotFound404 } from "../NotFound404";

export const RaffleInfo = () => {
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [preview, setPreview] = useState(null);
    const [description, setDescription] = useState('');
    const [silver, setSilver] = useState({ winner: '', reward: '', rewardPhoto: null, });
    const [gold, setGold] = useState({ winner: '', reward: '', rewardPhoto: null, });
    const [bronze, setBronze] = useState({ winner: '', reward: '', rewardPhoto: null, });
    const dateTimeNow = new Date();
    dateTimeNow.setMinutes(dateTimeNow.getMinutes() - dateTimeNow.getTimezoneOffset())
    const [dateTime, setDateTime] = useState(dateTimeNow.toISOString().slice(0, 16));
    const [live, setLive] = useState('');
    const [donate, setDonate] = useState('');
    const [isRaffle, setRaffle] = useState(true);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "raffles", "raffle"), (doc) => {
            if (doc.exists()) {
                const raffle = doc.data();
                setTitle(raffle.title);
                setPreview(raffle.preview);
                setDescription(raffle.description);
                setSilver(raffle.silver);
                setGold(raffle.gold);
                setBronze(raffle.bronze);
                setDateTime(raffle.dateTime);
                setLive(raffle.live);
                setDonate(raffle.donate);
                setRaffle(true);
            } else {
                setRaffle(false);
            }
            setLoading(false);
        });
        return () => {
            unSub();
        }
    }, []);


    if (!isRaffle) {
        return <NotFound404 />
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
                                <h3>{title}</h3>
                            </div>
                        </div>
                        <div className="draw__preview">
                            {preview &&
                                <>
                                    <div className="draw__preview-image">
                                        <img src={preview instanceof File ? URL.createObjectURL(preview) : preview} alt="" />
                                    </div>
                                </>
                            }
                        </div>
                        <div className="draw__description">
                            <h4 className="title md">Опис розіграшу</h4>
                            <div className="text__wrap ds">
                                {description}
                            </div>
                        </div>
                        <div className="draw__rewards">
                            <h4 className="title md">Призи</h4>
                            <div className="draw__rewards-items">
                                <div className="draw__rewards-item silver">
                                    {silver.rewardPhoto &&
                                        <>
                                            <div className="draw__rewards-image">
                                                <img src={silver.rewardPhoto instanceof File ? URL.createObjectURL(silver.rewardPhoto) : silver.rewardPhoto} alt="Срібло" />
                                            </div>
                                        </>
                                    }
                                    <div className="draw__rewards-winner">
                                        <div className="draw__rewards-place">
                                            <img src='https://firebasestorage.googleapis.com/v0/b/gans-random.appspot.com/o/icons%2Fsilver.png?alt=media&token=96dc01ae-198b-455f-b2d8-c47f0966c0a6' alt="Срібло" />
                                        </div>
                                    </div>
                                    <div className="draw__rewards-reward">
                                        <input
                                            type="text"
                                            className="input fill"
                                            placeholder="2nd"
                                            value={silver.reward}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="draw__rewards-item gold">
                                    {gold.rewardPhoto &&
                                        <>
                                            <div className="draw__rewards-image">
                                                <img src={gold.rewardPhoto instanceof File ? URL.createObjectURL(gold.rewardPhoto) : gold.rewardPhoto} alt="Золото" />
                                            </div>
                                        </>
                                    }
                                    <div className="draw__rewards-winner">
                                        <div className="draw__rewards-place">
                                            <img src='https://firebasestorage.googleapis.com/v0/b/gans-random.appspot.com/o/icons%2Fgold.png?alt=media&token=f52d79a1-1df0-4a98-86a2-7d713fc8fc35' alt="Золото" />
                                        </div>
                                    </div>
                                    <div className="draw__rewards-reward">
                                        <input
                                            type="text"
                                            className="input fill"
                                            placeholder="1st"
                                            value={gold.reward}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="draw__rewards-item bronze">
                                    {bronze.rewardPhoto &&
                                        <>
                                            <div className="draw__rewards-image">
                                                <img src={bronze.rewardPhoto instanceof File ? URL.createObjectURL(bronze.rewardPhoto) : bronze.rewardPhoto} alt="Бронза" />
                                            </div>
                                        </>
                                    }
                                    <div className="draw__rewards-winner">
                                        <div className="draw__rewards-place">
                                            <img src='https://firebasestorage.googleapis.com/v0/b/gans-random.appspot.com/o/icons%2Fbronze.png?alt=media&token=58be1a6d-6d6b-42af-bce4-79d0e410985c' alt="Бронза" />
                                        </div>
                                    </div>

                                    <div className="draw__rewards-reward">
                                        <input
                                            type="text"
                                            className="input fill"
                                            placeholder="3rd"
                                            value={bronze.reward}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="draw__end-time">
                            <h3 className="title md">День та час закінчення розіграшу</h3>
                            <div className="text__wrap tt"><h3>{convertDateTime(dateTime)}</h3></div>
                        </div>
                        <div className="draw__link-live">
                            <h3 className="title md">Посилання на ефір</h3>
                            <a href={live}>
                                <div className="text__wrap tt"><h4>{live}</h4></div>
                            </a>
                        </div>
                        <div className="draw__link-donate">
                            <h3 className="title md">Посилання на донат</h3>
                            <a href={donate}>
                                <div className="text__wrap tt"><h4>{donate}</h4></div>
                            </a>
                        </div>
                    </div>
                </div>
            </>
        }
    </>
}