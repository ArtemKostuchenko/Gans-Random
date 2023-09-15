import Dialog from '@mui/material/Dialog';
import { useState } from "react"


export const EmailDialog = ({ open, setOpen, callback, cancel_callback }) => {
    const [password, setPassword] = useState('');
    const handleClose = () => {
        cancel_callback();
        setOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        callback(password);
        setOpen(false);
    }

    return <>
        <Dialog open={open} onClose={handleClose}>
            <div className="form change">
                <h3 className="title md">Зміна електронної пошти</h3>
                <form className="form__content" onSubmit={handleSubmit}>
                    <div className="form__item">
                        <p className='change__description'>Щоб змінити електрону пошту, потрібно підтвердити чи належить вам цей аккаунт</p>
                    </div>
                    <div className="form__item">
                        <h4 className="form__item-name">Пароль</h4>
                        <div className="form__item-input">
                            <input type="password" className="input fill" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="form__item submit">
                        <button className="button pallet-2">Підтвердити</button>
                    </div>
                </form>
            </div>
        </Dialog>
    </>
}