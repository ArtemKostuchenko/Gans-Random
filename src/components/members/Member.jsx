import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

export const Member = ({ index, member, members, setMembers, ticketsAmount, setTicketsAmount }) => {
    const [nickname, setNickName] = useState(member.nickname);
    const [tickets, setTickets] = useState(member.tickets);
    const [additionalTickets, setAdditionalTickets] = useState('');

    const updateNickName = () => {
        if (nickname !== member.nickname) {
            const memberIndex = members.findIndex((mb) => mb.nickname === member.nickname);
            if (memberIndex !== -1) {
                const newMembers = members.map((mb, index) => {
                    if (memberIndex === index) {
                        return {
                            id: mb.id,
                            nickname: nickname,
                            tickets: mb.tickets,
                        }
                    } else {
                        return mb;
                    }
                });
                setMembers(newMembers);
            }
        }
    }

    const updateTickets = () => {
        const memberIndex = members.findIndex((mb) => mb.nickname === member.nickname);
        if (memberIndex !== -1 && Number(member.tickets) !== Number(tickets)) {
            const newMembers = members.map((mb, index) => {
                if (memberIndex === index) {
                    setTicketsAmount(Number(ticketsAmount - mb.tickets) + Number(tickets));
                    return {
                        id: mb.id,
                        nickname: mb.nickname,
                        tickets: Number(tickets),
                    }
                } else {
                    return mb;
                }
            });
            setMembers(newMembers);
        }
    }

    const addTickets = () => {
        if (additionalTickets) {
            const memberIndex = members.findIndex((mb) => mb.nickname === member.nickname);
            if (memberIndex !== -1) {
                const newMembers = members.map((mb, index) => {
                    if (memberIndex === index) {
                        setTicketsAmount(Number(additionalTickets) + ticketsAmount);
                        return {
                            id: mb.id,
                            nickname: mb.nickname,
                            tickets: Number(mb.tickets) + Number(additionalTickets),
                        }

                    } else {
                        return mb;
                    }
                });
                setAdditionalTickets('');
                setMembers(newMembers);
            }
        }
    }

    const deleteMember = () => {
        const newMembers = members.filter((mb) => mb.nickname !== member.nickname);
        setTicketsAmount(ticketsAmount - Number(member.tickets));
        setMembers(newMembers);
    }

    return <>
        <h4 className="members__counter">{index + 1}.</h4>
        <div className="members__nickname">
            <input
                type="text"
                className="input outline"
                defaultValue={nickname}
                onChange={(e) => setNickName(e.target.value)}
                onBlur={updateNickName}
            />
        </div>
        <h4 className="members__win-rate">{((100 * member.tickets) / ticketsAmount) <= 100? ((100 * member.tickets) / ticketsAmount).toFixed(1): '100.0'}%</h4>
        <div className="members__tickets">
            <input
                type="text"
                className="input outline"
                defaultValue={tickets}
                onChange={(e) => setTickets(e.target.value.replace(/\D/g, ''))}
                onBlur={updateTickets}
            />
        </div>
        <div className="members__plus">
            <AddIcon sx={{ color: 'white', fontSize: 20, }} />
        </div>
        <div className="members__additional-tickets">
            <input
                type="text"
                className="input outline"
                placeholder="Дод. квитки"
                defaultValue={additionalTickets}
                onChange={(e) => setAdditionalTickets(e.target.value.replace(/\D/g, ''))}
                onBlur={addTickets}
            />
        </div>
        <div className="members__delete">
            <DeleteIcon sx={{ color: 'white', fontSize: 28 }} onClick={deleteMember} />
        </div>
    </>
}