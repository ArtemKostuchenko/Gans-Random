import AccountMenu from "../menu/AccountMenu";
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth"
import { useAuth } from '../../hooks/auth';
import { useDispatch } from "react-redux";
import { clearUser } from "../../store/slices/userSlice";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts/context";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";

export const Header = ({ isLoading }) => {
    const { showAlertMessage } = useContext(AppContext);
    const auth = getAuth();
    const dispatch = useDispatch();
    const { isAuth } = useAuth();
    const uid = Boolean(window.localStorage.getItem('_id'));
    const [raffleExist, setRaffle] = useState(null);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'raffles', 'raffle'), (doc) => {
            setRaffle(doc.exists())
        });
        return () => {
            unSub();
        }
    }, []);

    const logout = () => {
        signOut(auth).then(() => {
            dispatch(clearUser());
            showAlertMessage('Вихід виконано', 'success');
            window.localStorage.removeItem('_id')
        }).catch(() => {
            showAlertMessage('Помилка виходу з аккаунту', 'error')
        });
    }

    return <>
        <header className="header buttons">
            <Link to='/' className="header__title">
                Gans Random
            </Link>

            {isLoading && uid && raffleExist === null &&
                <>
                    <div className="header__profile">
                        <div className="skeleton avatar sm"></div>
                    </div>
                    <div className="header__logout">
                        <div className="skeleton logout"></div>
                    </div>
                </>
            }

            {isLoading && !uid && raffleExist === null &&
                <>
                    <div className="header__button">
                        <div className="skeleton button">Увійти</div>
                    </div>
                </>
            }

            {isAuth && !isLoading && raffleExist !== null ?
                <>
                    <div className="header__profile">
                        <AccountMenu raffleExist={raffleExist} />
                    </div>
                    <div className="header__logout">
                        <LogoutIcon sx={{ color: 'white', fontSize: 26, }} onClick={logout}></LogoutIcon>
                    </div>
                </>
                : !isAuth && !isLoading && raffleExist !== null &&
                <>
                    <div className="header__button">
                        <Link to='/login'>
                            <button className="button primary">
                                Увійти
                            </button>
                        </Link>
                    </div>
                </>
            }
        </header>
    </>
}