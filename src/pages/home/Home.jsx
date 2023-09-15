import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from 'react';
import { useAuth } from "../../hooks/auth"
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { convertDateTime } from "../../utils/functions";
import { Timer } from "../../components/others/Timer";
import { MembersAdmin } from "../../components/members/MembersAdmin";
import { MembersClient } from "../../components/members/MembersClient";
import { RaffleTimer } from "../../components/raffle/RaffleTimer";
import { RafflesWinners } from "../../pages/raffle/winners";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";


export const Home = () => {
    const { isAuth, timer } = useAuth();
    const [raffle, setRaffle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [membersLoaded, setMembersLoaded] = useState(false);
    const [members, setMembers] = useState([]);
    const [nickname, setNickName] = useState('');
    const [tickets, setTickets] = useState('');
    const [ticketsAmount, setTicketsAmount] = useState(0);
    const [filter, setFilter] = useState('');
    const [isTimer, setTimer] = useState(false);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'raffles', 'raffle'), (doc) => {
            setRaffle(doc.data());
            setLoading(false);
        });

        const unSubMembers = onSnapshot(doc(db, 'raffles', 'members'), (doc) => {
            if (doc.exists()) {
                const membersObj = doc.data();
                setMembers(membersObj.members);
                setTicketsAmount(membersObj.ticketsAmount);
            }
            setMembersLoaded(true);
        });

        return () => {
            unSub();
            unSubMembers();
        }
    }, []);

    useEffect(() => {
        if (isAuth && !loading && membersLoaded) {
            const refDB = doc(db, 'raffles', 'members');
            setDoc(refDB, {
                members,
                ticketsAmount,
            }).then(() => { }).catch((err) => console.error(err));
        }
    }, [members, ticketsAmount, isAuth, loading, membersLoaded]);

    const finishRaffle = () => {
        setTimer(true)
    }


    const filteredMembers = members.filter((member) =>
        member.nickname.toLowerCase().includes(filter.toLowerCase())
    );

    const addMember = () => {
        if (nickname && tickets) {
            const filter = members.findIndex((members) => members.nickname === nickname);
            if (filter !== -1) {
                const newMembers = members.map((member, index) => {
                    if (index === filter) {
                        return {
                            id: member.id,
                            nickname: member.nickname,
                            tickets: Number(member.tickets) + Number(tickets),
                        }
                    } else {
                        return member;
                    }
                });
                setMembers(newMembers);
            } else {
                setMembers([...members, {
                    id: uuidv4(),
                    nickname,
                    tickets: Number(tickets),
                }]);
            }
            setTicketsAmount(Number(ticketsAmount) + Number(tickets));
        }
        setNickName('');
        setTickets('');
    }

    return <>
        {raffle && <>
            {Boolean(raffle?.winners.length) && <RafflesWinners />}
            {isTimer && isAuth && <RaffleTimer title={raffle.title} image={raffle.preview} duration={timer} setTimer={setTimer} />}
            {!isAuth && raffle?.startTime && <RaffleTimer title={raffle.title} image={raffle.preview} duration={timer} setTimer={setTimer} />}
            {!isTimer && !raffle?.startTime && !Boolean(raffle?.winners.length) &&
                <>
                    <div className="raffle client">
                        <div className="members">
                            {isAuth &&
                                <>

                                    <>
                                        <div className="members__filter">
                                            <div className="members__add">
                                                <div className="members__nickname">
                                                    <input
                                                        type="text"
                                                        className="input outline"
                                                        placeholder="Нікнейм учасника"
                                                        value={nickname}
                                                        onChange={(e) => setNickName(e.target.value)}
                                                    />
                                                </div>
                                                <h4 className="members__win-rate">{ticketsAmount !== 0 ? ((100 * Number(tickets)) / (ticketsAmount + Number(tickets))).toFixed(1) : 100}%</h4>
                                                <div className="members__tickets">
                                                    <input
                                                        type="text"
                                                        className="input outline"
                                                        placeholder="Квитки"
                                                        value={tickets}
                                                        onChange={(e) => setTickets(e.target.value.replace(/\D/g, ''))}
                                                    />
                                                </div>
                                                <div className="members__add-button">
                                                    <button className="button pallet-2" onClick={addMember}>
                                                        <AddIcon />
                                                        Додати учасника
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="members__search">
                                                <SearchIcon sx={{ color: 'white', fontSize: 28 }} />
                                                <input
                                                    type="text"
                                                    className="input fill"
                                                    placeholder="Знайти"
                                                    value={filter}
                                                    onChange={(e) => setFilter(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="members__amount">
                                            <h3>
                                                Кількість учасників: <span>{members.length}</span>
                                            </h3>
                                        </div>
                                        <MembersAdmin members={members} filteredMembers={filteredMembers} ticketsAmount={ticketsAmount} setMembers={setMembers} setTicketsAmount={setTicketsAmount} />
                                    </>
                                </>
                            }
                            {!isAuth &&
                                <>
                                    <div className="members">
                                        <div className="members__filter client">
                                            <div className="members__search client">
                                                <SearchIcon sx={{ fontSize: 28, color: '#fff' }} />
                                                <input
                                                    type="text"
                                                    className="input fill"
                                                    placeholder="Знайти"
                                                    onChange={(e) => setFilter(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        {loading &&
                                            <>
                                                <div className="members__amount">
                                                    <h3 className="skeleton title md auto">Кількість учасників:</h3>
                                                </div>
                                                <div className="members__items">
                                                    {Array.from({ length: 10 }).map((val, index) => {
                                                        return (
                                                            <div className="members__item client skeleton bbg" key={index}></div>
                                                        )
                                                    })}
                                                </div>
                                            </>
                                        }
                                        {!loading &&
                                            <>
                                                <div className="members__amount">
                                                    <h3>
                                                        Кількість учасників: <span>{members.length}</span>
                                                    </h3>
                                                </div>
                                                <MembersClient members={members} filteredMembers={filteredMembers} ticketsAmount={ticketsAmount} />
                                            </>
                                        }
                                    </div>
                                </>
                            }
                        </div>
                        {loading &&
                            <>
                                <div className="raffle__item">
                                    <div className="raffle__info">
                                        <div className="skeleton title bg"></div>
                                        <a href="/raffle/:id">
                                            <div className="raffle__image">
                                                <div className="skeleton"></div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="raffle__time">
                                        <div className="skeleton title md"></div>
                                        <h3 className="raffle__time-time skeleton">13:24:25</h3>
                                    </div>
                                    <div className="raffle__end">
                                        <div className="skeleton title md"></div>
                                        <div className="skeleton title">00.00.0000 00:00:00</div>
                                    </div>
                                    <div className="raffle__live">
                                        <div className="skeleton title md">Посиланння на ефір</div>
                                        <div className="skeleton title md"></div>
                                    </div>
                                    <div className="raffle__donate">
                                        <div className="skeleton title md">Посилання на донат</div>
                                        <div className="skeleton title md"></div>
                                    </div>
                                </div>
                            </>
                        }
                        {!loading && raffle &&
                            <>
                                <div className="raffle__item">
                                    <div className="raffle__info">
                                        <Link to='/raffle'>
                                            <h1 className="raffle__title">{raffle.title}</h1>
                                        </Link>
                                        <Link to='/raffle'>
                                            <div className="raffle__image">
                                                <img
                                                    src={raffle.preview}
                                                    alt={raffle.title}
                                                />
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="raffle__time">
                                        <h2 className="raffle__time-title">Залишилось часу</h2>
                                        <Timer date_time={raffle.dateTime} />
                                    </div>
                                    {isAuth && <button className="button pallet-4" onClick={finishRaffle}>Розпочати розіграш</button>}
                                    <div className="raffle__end">
                                        <h2 className="raffle__end-title">Кінець розіграшу</h2>
                                        <h3 className="raffle__end-time">{convertDateTime(raffle.dateTime)}</h3>
                                    </div>
                                    <div className="raffle__live">
                                        <h2 className="raffle__live-title">Посиланння на ефір</h2>
                                        <a
                                            href={raffle.live}
                                            className="raffle__live-link"
                                        >
                                            {raffle.live}
                                        </a>
                                    </div>
                                    <div className="raffle__donate">
                                        <h2 className="raffle__donate-title">Посилання на донат</h2>
                                        <a href={raffle.donate} className="raffle__donate-link">
                                            {raffle.donate}
                                        </a>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </>
            }
        </>}
        {!raffle && !loading &&
            <>
                <div className="message">
                    <div className="message__content">
                        <div className="message__image">
                            <img src="https://firebasestorage.googleapis.com/v0/b/gans-random.appspot.com/o/images%2Flike_bob.gif?alt=media&token=65055eef-c19f-402c-b47e-52b8ddeb83ed" alt="Розіграшів поки немає" />
                        </div>
                        <div className="message__title">Розіграшів поки немає</div>
                        <div className="message__description sm">Зачекайте наступного розіграшу</div>
                    </div>
                </div>
            </>
        }
    </>
}