import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { setUser } from './store/slices/userSlice';
import { AppContext } from './contexts/context';
import { Home } from './pages/home/Home';
import { Login } from './pages/auth/Login';
import { Profile } from './pages/auth/Profile';
import { RaffleCreate } from './pages/raffle/create';
import { RaffleEdit } from './pages/raffle/edit';
import { RaffleInfo } from './pages/raffle/view';
import { History } from  './pages/History';
import { RaffleArchive } from './pages/raffle/archive';
import { NotFound404 } from './pages/NotFound404';
import { AlertMessage } from './components/others/AlertMessage';
import { Header } from './components/others/Header';
import { StarEffect } from './components/others/StarEffect';
import './scss/style.scss';

function App() {
  const dispatch = useDispatch();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');


  const updateUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const timer = window.localStorage.getItem('_timer') ? window.localStorage.getItem('_timer') : 30;
        const effect = window.localStorage.getItem('_effect') ? window.localStorage.getItem('_effect') : 'false';
        dispatch(setUser({
          email: user.email,
          nickname: user.displayName,
          photoURL: user.photoURL,
          timer: timer,
          effect: effect,
          token: user.accessToken,
          uid: user.uid
        }));
        window.localStorage.setItem('_id', user.uid);
      } else {
        window.localStorage.removeItem('_id');
      }
    });
  }

  const getAuthUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const timer = window.localStorage.getItem('_timer') ? window.localStorage.getItem('_timer') : 30;
        const effect = window.localStorage.getItem('_effect') ? window.localStorage.getItem('_effect') : 'false';
        dispatch(setUser({
          email: user.email,
          nickname: user.displayName,
          photoURL: user.photoURL,
          timer: timer,
          effect: effect,
          token: user.accessToken,
          uid: user.uid
        }));
        window.localStorage.setItem('_id', user.uid);
      } else {
        window.localStorage.removeItem('_id');
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    getAuthUser();
  }, []);

  const showAlertMessage = (message, type = 'success') => {
    setShowMessage(true);
    setMessage(message);
    setSeverity(type);
  }

  return (
    <AppContext.Provider value={{ showAlertMessage, updateUser }}>
      <StarEffect />
      <div className="wrapper">
        <AlertMessage open={showMessage} setOpen={setShowMessage} message={message} severity={severity} />
        <Header isLoading={loading} />
        <main className="main">
          <div className="content">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/profile' element={<Profile isLoading={loading} />} />
              <Route path='/raffle' element={<RaffleInfo />} />
              <Route path='/raffle/create' element={<RaffleCreate isLoading={loading} />} />
              <Route path='/raffle/edit' element={<RaffleEdit />} />
              <Route path='/raffle/history' element={<History />} />
              <Route path='/raffle/:id' element={<RaffleArchive/>} />
              <Route path='*' element={<NotFound404/>} />
            </Routes>
          </div>
        </main>
        <footer className="footer">
          <h4 className="footer__title">
            Ⓒ All rights reserved 2023 | Artem Kostuchenko
          </h4>
        </footer>
      </div>
    </AppContext.Provider>
  );
}

export default App;
