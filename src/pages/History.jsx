import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { convertDateTime } from '../utils/functions';
import { HistoryItem } from '../components/others/HistoryItem';
import SearchIcon from '@mui/icons-material/Search';

export const History = () => {
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'raffles', 'history'), (doc) => {
            if (doc.exists()) {
                setHistories(doc.data().histories);
                setLoading(false);
            }
        });
        return () => {
            unSub();
        }
    }, []);

    return <>
        <div className="draw">
            <div className="draw__history">
                <div className="draw__title center">
                    <h4 className="title bg">Історія розіграшів</h4>
                </div>
                <div className="draw__history-search">
                    <div className="members__search">
                        <SearchIcon sx={{ color: 'white', fontSize: 28 }} />
                        <input type="text" className="input fill" placeholder="Знайти" />
                    </div>
                </div>
                <div className="draw__history-items">
                    {loading &&
                        <>
                            {Array.from({ length: 10 }).map((_, index) => {
                                return <><div key={index} className="skeleton title bbg"></div></>
                            })}
                        </>
                    }
                    {!loading &&
                        <>
                            {!Boolean(histories.length) &&
                                <>
                                    <div className="message">
                                        <div className="message__content">
                                            <div className="message__image">
                                                <img src="https://firebasestorage.googleapis.com/v0/b/gans-random.appspot.com/o/images%2Fpiano_bob.gif?alt=media&token=a5748072-00f8-4e07-963c-c235da5b06c9" alt="Історія відсутня" />
                                            </div>
                                            <div className="message__title">Історія відсутня</div>
                                            <div className="message__description sm">Після завершення розіграшу, тут з'явиться розіграш</div>
                                        </div>
                                    </div>
                                </>
                            }
                            {histories.map((history, index) => {
                                return <HistoryItem key={index} index={index + 1} id={history.id} title={history.title} datetime={convertDateTime(history.dateTime)} />
                            })}
                        </>
                    }
                </div>
            </div>
        </div>
    </>
}