import Dialog from '@mui/material/Dialog';
import { useState } from "react"


export const PasswordDialog = ({ open, setOpen, callback,}) => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        callback(password, newPassword);
        setOpen(false);
    }

    return <>
        <Dialog open={open} onClose={handleClose}>
            <div className="form change">
                <h3 className="title md">Зміна пароля</h3>
                <form className="form__content" onSubmit={handleSubmit}>
                    <div className="form__item">
                        <h4 className="form__item-name">Старий пароль</h4>
                        <div className="form__item-input">
                            <input type="password" className="input fill" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="form__item">
                        <h4 className="form__item-name">Новий пароль</h4>
                        <div className="form__item-input">
                            <input type="password" className="input fill" onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                    </div>
                    <div className="form__item submit">
                        <button className="button pallet-2">Змінити</button>
                    </div>
                </form>
            </div>
        </Dialog>
    </>
}