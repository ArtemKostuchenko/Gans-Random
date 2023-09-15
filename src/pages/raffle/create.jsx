import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/auth';
import { AppContext } from "../../contexts/context";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { NotFound404 } from "../NotFound404";
import { saveRaffle, uploadRaffleImage } from "../../utils/functions";

export const RaffleCreate = ({ isLoading }) => {
    const navigate = useNavigate()
    const { isAuth } = useAuth();
    const { showAlertMessage } = useContext(AppContext);
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
    const [open, setOpen] = useState(false);


    const createRaffle = async () => {
        if (!preview) {
            showAlertMessage('Оберіть превью розіграшу', 'error');
            return;
        }

        try {
            setOpen(true);

            const preview_url = await uploadRaffleImage(preview);
            const silver_url = silver.rewardPhoto ? await uploadRaffleImage(silver.rewardPhoto) : '';
            const gold_url = gold.rewardPhoto ? await uploadRaffleImage(gold.rewardPhoto) : '';
            const bronze_url = bronze.rewardPhoto ? await uploadRaffleImage(bronze.rewardPhoto) : '';
            saveRaffle({ title, description, silver, gold, bronze, dateTime, live, donate }, preview_url, silver_url, gold_url, bronze_url).then(() => {
                setOpen(false);
                showAlertMessage('Розіграш створено', 'success');
                navigate('/')
            }).catch(() => {
                setOpen(false);
                showAlertMessage('Невдалося створити розіграш', 'error');
            });
        } catch (error) {
            setOpen(false);
            showAlertMessage('Невдалося створити розіграш', 'error');
        }
    }

    if (!isAuth) {
        return <NotFound404 />
    }

    return <>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
            <CircularProgress color="inherit" />
            <div className="title md" style={{ marginLeft: '6px' }}>Створення розіграшу</div>
        </Backdrop>
        {isLoading &&
            <>
                <div className="draw">
                    <div className="draw__create">
                        <div className="draw__title">
                            <div className="skeleton title"></div>
                            <div className="skeleton input"></div>
                        </div>
                        <div className="draw__preview">
                            <div className="draw__preview-file">
                                <div className="skeleton input file">Обрати фото</div>
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
                                    <div className="draw__rewards-file">
                                        <div className="skeleton input file">Обрати фото</div>
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
                                    <div className="draw__rewards-file">
                                        <div className="skeleton input file">Обрати фото</div>
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
                                    <div className="draw__rewards-file">
                                        <div className="skeleton input file">Обрати фото</div>
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
                        <div className="draw__button">
                            <div className="skeleton button">Створити розіграш</div>
                        </div>
                    </div>
                </div>
            </>
        }
        {!isLoading && isAuth &&
            <>
                <div className="draw">
                    <div className="draw__create">
                        <div className="draw__title">
                            <h4 className="title md">Назва розіграшу</h4>
                            <input
                                type="text"
                                className="input fill"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="draw__preview">
                            {preview &&
                                <>
                                    <div className="draw__preview-image">
                                        <img src={preview instanceof File ? URL.createObjectURL(preview) : preview} alt="" />
                                    </div>
                                </>
                            }
                            <div className="draw__preview-file">
                                <input
                                    type="file"
                                    className="input fill-file"
                                    onChange={(e) => {
                                        setPreview(e.target.files[0])
                                    }}
                                />
                            </div>
                        </div>
                        <div className="draw__description">
                            <h4 className="title md">Опис розіграшу</h4>
                            <textarea
                                className="description fill"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
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
                                    <div className="draw__rewards-file">
                                        <input
                                            type="file"
                                            className="input fill-file"
                                            onChange={(e) => setSilver({ ...silver, rewardPhoto: e.target.files[0] })}
                                        />
                                    </div>
                                    <div className="draw__rewards-reward">
                                        <input
                                            type="text"
                                            className="input fill"
                                            placeholder="2nd"
                                            value={silver.reward}
                                            onChange={(e) => setSilver({ ...silver, reward: e.target.value })}
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
                                    <div className="draw__rewards-file">
                                        <input
                                            type="file"
                                            className="input fill-file"
                                            onChange={(e) => setGold({ ...gold, rewardPhoto: e.target.files[0] })}
                                        />
                                    </div>
                                    <div className="draw__rewards-reward">
                                        <input
                                            type="text"
                                            className="input fill"
                                            placeholder="1st"
                                            value={gold.reward}
                                            onChange={(e) => setGold({ ...gold, reward: e.target.value })}
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
                                    <div className="draw__rewards-file">
                                        <input
                                            type="file"
                                            className="input fill-file"
                                            onChange={(e) => setBronze({ ...bronze, rewardPhoto: e.target.files[0] })}
                                        />
                                    </div>
                                    <div className="draw__rewards-reward">
                                        <input
                                            type="text"
                                            className="input fill"
                                            placeholder="3rd"
                                            value={bronze.reward}
                                            onChange={(e) => setBronze({ ...bronze, reward: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="draw__end-time">
                            <h3 className="title md">День та час закінчення розіграшу</h3>
                            <input
                                type="datetime-local"
                                className="input fill-date"
                                value={dateTime}
                                onChange={(e) => setDateTime(e.target.value)}
                            />
                        </div>
                        <div className="draw__link-live">
                            <h3 className="title md">Посилання на ефір</h3>
                            <input
                                type="text"
                                className="input fill"
                                value={live}
                                onChange={(e) => setLive(e.target.value)}
                            />
                        </div>
                        <div className="draw__link-donate">
                            <h3 className="title md">Посилання на донат</h3>
                            <input
                                type="text"
                                className="input fill"
                                value={donate}
                                onChange={(e) => setDonate(e.target.value)}
                            />
                        </div>
                        <div className="draw__button">
                            <button className="button pallet-2" onClick={createRaffle}>Створити розіграш</button>
                        </div>
                    </div>
                </div>
            </>
        }
    </>
}