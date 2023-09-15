import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import { AppContext } from '../../contexts/context';
import { getAuth, signInWithEmailAndPassword, } from 'firebase/auth';

export const Login = () => {
    const { showAlertMessage } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then((credentials) => {
                    const user = credentials.user
                    dispatch(setUser({
                        email: user.email,
                        nickname: user.displayName,
                        photoURL: user.photoURL,
                        time: 30,
                        effect: true,
                        token: user.accessToken,
                        uid: user.uid
                    }));
                    window.localStorage.setItem('_id', user.uid)
                    showAlertMessage('Вхід виконано', 'success')
                    navigate('/');
                }).catch((err) => {
                    showAlertMessage('Неправильна електронна пошта або пароль', 'error')
                });
        }
    }

    return <>
        <div className="login">
            <div className="form">
                <h3 className="form__title">Вхід</h3>
                <form className="form__content" onSubmit={handleLogin}>
                    <div className="form__item">
                        <h4 className="form__item-name">Електрона пошта</h4>
                        <div className="form__item-input">
                            <input
                                type="email"
                                className="input fill"
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form__item">
                        <h4 className="form__item-name">Пароль</h4>
                        <div className="form__item-input">
                            <input type="password"
                                className="input fill"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form__item submit">
                        <button className="button primary">Увійти</button>
                    </div>
                </form>
            </div>
        </div>
    </>
}