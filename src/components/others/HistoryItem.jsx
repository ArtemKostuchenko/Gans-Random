import DeleteIcon from '@mui/icons-material/Delete';
import { useContext,} from "react"
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { AppContext } from "../../contexts/context";

export const HistoryItem = ({ index, id, title, datetime }) => {
    const navigate = useNavigate();
    const { showAlertMessage } = useContext(AppContext);

    const removeRaffle = () => {
        const refHistory = doc(db, 'raffles', 'history');
        getDoc(refHistory).then((doc) => {
            if (doc.exists()) {
                const histories = doc.data().histories.filter((history) => history.id !== id);
                updateDoc(refHistory, {
                    histories
                }).then(() => {
                    showAlertMessage('Розіграш видалено')
                    navigate('/raffle/history')
                }).catch(() => showAlertMessage('Помилка видалення розіграшу', 'error'));
            }
        }).catch(() => showAlertMessage('Помилка видалення розіграшу', 'error'));
    }


    return <>
        <div className="draw__history-item" key={index}>
            <div className="draw__history-counter">{index}.</div>
            <Link to={`/raffle/${id}`}>
                <h3 className="draw__history-name text__wrap">{title}</h3>
            </Link>
            <h3 className="draw__history-end">{datetime}</h3>
            <div className="draw__history-remove">
                <DeleteIcon sx={{ color: 'white', fontSize: 28, cursor: 'pointer' }} onClick={removeRaffle} />
            </div>
        </div>
    </>
}