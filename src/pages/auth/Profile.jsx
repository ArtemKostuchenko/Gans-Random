import { useContext, useEffect, useRef, useState } from "react";
import { useAuth } from '../../hooks/auth';
import { AppContext } from "../../contexts/context";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile, updateEmail, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { storage } from "../../utils/firebase";
import { uploadBytes, getDownloadURL, deleteObject, ref } from "firebase/storage";
import { EmailDialog } from "../../components/others/EmailDialog";
import { PasswordDialog } from "../../components/others/PasswordDialog";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import { green } from "@mui/material/colors";


export const Profile = ({ isLoading }) => {
    const auth = getAuth();
    const userAuth = useAuth();
    const navigate = useNavigate();
    const { showAlertMessage, updateUser } = useContext(AppContext);
    const [editing, setEditing] = useState(false);
    const [photoURL, setPhotoURL] = useState(userAuth.photoURL)
    const [nickname, setNickName] = useState(userAuth.nickname);
    const [email, setEmail] = useState(userAuth.email);
    const [timer, setTimer] = useState(userAuth.timer);
    const [fire, setFire] = useState(userAuth.effect);
    const [emailDialog, setEmailDialog] = useState(false);
    const [passwordDialog, setPasswordDialog] = useState(false);

    const inputFile = useRef();

    useEffect(() => {
        setPhotoURL(userAuth.photoURL);
        setNickName(userAuth.nickname);
        setEmail(userAuth.email);
        setTimer(userAuth.timer);
        setFire(userAuth.effect);
    }, [userAuth.isAuth, userAuth.photoURL, userAuth.nickname, userAuth.email, userAuth.timer, userAuth.effect]);

    const savePassword = (password, newPassword) => {
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            password,
        )
        reauthenticateWithCredential(auth.currentUser, credential).then((onoffline) => {
            if (onoffline.user) {
                updatePassword(auth.currentUser, newPassword).then(() => {
                    showAlertMessage('Пароль оновлено', 'success')
                }).catch(() => {
                    showAlertMessage('Помилка оновлення пароля', 'error')
                });
            }
        }).catch(() => {
            showAlertMessage('Неправильний пароль', 'error')
        });
    }

    const saveEmail = (password) => {
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            password,
        )
        reauthenticateWithCredential(auth.currentUser, credential).then((onoffline) => {
            if (onoffline.user) {
                updateEmail(auth.currentUser, email).then(() => {
                    updateUser();
                    showAlertMessage('Електронна пошта оновлена', 'success')
                }).catch(() => {
                    showAlertMessage('Помилка оновлення електроної пошти', 'error')
                });
            }
        }).catch(() => {
            setEmail(userAuth.email);
            showAlertMessage('Неправильний пароль', 'error')
        });
    }

    const saveProfile = () => {
        if (editing) {
            if (userAuth.email !== email) {
                setEmailDialog(true)
            } else {
                if (userAuth.nickname !== nickname) {
                    updateProfile(auth.currentUser, {
                        displayName: nickname
                    }).then(() => {
                        updateUser();
                        showAlertMessage('Профіль оновлено', 'success');

                    }).catch((err) => {

                    });
                }
                if (userAuth.timer !== timer) {
                    window.localStorage.setItem('_timer', timer);
                    updateUser();
                    showAlertMessage('Профіль оновлено', 'success');
                }
                if (userAuth.effect !== fire) {
                    window.localStorage.setItem('_effect', fire);
                    updateUser();
                    showAlertMessage('Профіль оновлено', 'success');
                }
            }
        }
        setEditing(!editing)

    }

    const uploadPhotoProfile = (image) => {
        const reference = ref(storage, `profile/${Date.now()}_profile`);
        uploadBytes(reference, image).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                updateProfile(auth.currentUser, {
                    photoURL: url
                }).then(() => {
                    showAlertMessage('Фото оновлено', 'success');
                    setPhotoURL(url);
                    updateUser();
                }).catch(() => {

                });

            }).catch(() => {

            });
        }).catch(() => {
        });
    }

    const updatePhotoProfile = (image) => {
        const reference = ref(storage, photoURL)
        deleteObject(reference).then(() => {
            uploadPhotoProfile(image);
        }).catch(() => {
        });
    }

    const handleChangeFile = (e) => {
        if (photoURL == null)
            uploadPhotoProfile(e.target.files[0]);
        else
            updatePhotoProfile(e.target.files[0])
    }

    const handleInputFile = () => {
        inputFile.current.click();
    }


    const cancelChange = () => {
        setEmail(userAuth.email);
    }

    if (!isLoading && !userAuth.isAuth) {
        navigate('/');
    }

    const handleInputChange = (event) => {
        const sanitizedValue = event.target.value.replace(/\D/g, '');
        setTimer(sanitizedValue);
    };



    return <>
        {isLoading &&
            <>
                <div className="profile">
                    <div className="profile__image">
                        <div className="skeleton avatar"></div>
                    </div>
                    <div className="profile__info info">
                        <div className="info__items">
                            <div className="info__item">
                                <h3 className="info__name"><div className="skeleton title"></div></h3>
                                <div className="info__input">
                                    <div className="skeleton input"></div>
                                </div>
                            </div>
                            <div className="info__item">
                                <h3 className="info__name"><div className="skeleton title"></div></h3>
                                <div className="info__input">
                                    <div className="skeleton input"></div>
                                </div>
                            </div>
                            <div className="info__item">
                                <h3 className="info__name"><div className="skeleton title"></div></h3>
                                <div className="info__input">
                                    <div className="skeleton input"></div>
                                </div>
                            </div>
                            <div className="info__item">
                                <h3 className="info__name"><div className="skeleton title"></div></h3>
                                <div className="info__input">
                                    <input
                                        type="text"
                                        className="skeleton input"
                                        readOnly={!editing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile__buttons">
                        <div className="skeleton button">Змінити дані</div>
                        <div className="skeleton button">Змінити пароль</div>
                    </div>
                </div>
            </>
        }
        {userAuth.isAuth && !isLoading &&
            <>
                <EmailDialog open={emailDialog} setOpen={setEmailDialog} cancel_callback={cancelChange} callback={saveEmail} />
                <PasswordDialog open={passwordDialog} setOpen={setPasswordDialog} callback={savePassword} />
                <div className="profile">
                    <div className="profile__image">
                        {photoURL ?
                            <>
                                <Tooltip title="Змінити фото">
                                    <IconButton onClick={handleInputFile} sx={{ padding: 0 }}>
                                        <Avatar sx={{ width: 100, height: 100, padding: 0 }} src={photoURL}>
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                            </>
                            :
                            <>
                                <Tooltip title="Обрати фото">
                                    <IconButton onClick={handleInputFile} sx={{ padding: 0 }}>
                                        <Avatar sx={{ width: 100, height: 100, bgcolor: green[500], padding: 0 }}>{userAuth.nickname ? userAuth.nickname[0].toUpperCase() : userAuth?.email[0].toUpperCase()}</Avatar>
                                    </IconButton>
                                </Tooltip>
                            </>
                        }
                        <input ref={inputFile} type="file" accept="image/*" onChange={handleChangeFile} hidden />
                    </div>
                    <div className="profile__info info">
                        <div className="info__items">
                            <div className="info__item">
                                <h3 className="info__name">Нікнейм</h3>
                                <div className="info__input">
                                    <input
                                        type="text"
                                        className="input fill"
                                        readOnly={!editing}
                                        value={nickname}
                                        onChange={(e) => setNickName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="info__item">
                                <h3 className="info__name">Електрона пошта</h3>
                                <div className="info__input">
                                    <input
                                        type="email"
                                        className="input fill"
                                        readOnly={!editing}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="info__item">
                                <h3 className="info__name">Час відліку</h3>
                                <div className="info__input">
                                    <input type="text" className="input fill"
                                        value={timer}
                                        onChange={handleInputChange}
                                        readOnly={!editing}
                                    />
                                </div>
                            </div>
                            <div className="info__item">
                                <h3 className="info__name">Ефект зірок</h3>
                                <div className="info__input">
                                    <select className="select" onChange={(e) => setFire(e.target.value)} value={fire} disabled={!editing}>
                                        <option value="true">Так</option>
                                        <option value="false">Ні</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile__buttons">
                        <button className={`button ${editing ? 'pallet-2' : 'primary'}`} onClick={saveProfile}>
                            {editing ? 'Зберегти' : 'Змінити дані'}
                        </button>
                        <button className="button pallet-4" onClick={() => setPasswordDialog(!passwordDialog)}>
                            Змінити пароль
                        </button>
                    </div>
                </div>
            </>
        }
    </>
}