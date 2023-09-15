import { useSelector } from 'react-redux';

export const useAuth = () => {
    const { email, nickname, photoURL, timer, effect, token, uid } = useSelector(state => state.user);

    return {
        isAuth: !!token,
        email, 
        nickname, 
        photoURL, 
        timer, 
        effect, 
        token, 
        uid
    }
}