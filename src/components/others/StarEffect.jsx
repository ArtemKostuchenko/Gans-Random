import { useAuth } from "../../hooks/auth"


export const StarEffect = () => {
    const {effect} = useAuth();
    if (effect === 'true'){
        return <>
        <div className='stars'>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
        <div className='star'></div>
      </div>
    </>
    }
}