import { useEffect, useState } from "react";
import FlipMove from 'react-flip-move';

export const MembersClient = ({ members, filteredMembers, ticketsAmount }) => {
    const [sortedMembers, setSortedMembers] = useState([]);

    useEffect(() => {
        const sorted = members.slice().sort((a, b) => b.tickets - a.tickets);
        setSortedMembers(sorted);
    }, [members]);


    return <>
        {members.length === filteredMembers.length &&
            <>
                <div className="members__items">
                    <FlipMove duration={550} enterAnimation="fade" leaveAnimation="fade">
                        {sortedMembers.map((member, index) => (
                            <div className="members__item client" key={member.id}>
                                <h4 className="members__counter">{index + 1}.</h4>
                                <div className="members__nickname">
                                    <h3 className="text__wrap">{member.nickname}</h3>
                                </div>
                                <h4 className="members__win-rate">{((100 * member.tickets) / ticketsAmount).toFixed(1)}%</h4>
                                <div className="members__tickets">
                                    <h3 className="text__wrap">{member.tickets}</h3>
                                </div>
                            </div>
                        ))}
                    </FlipMove>
                </div>
            </>
        }
        {members.length !== filteredMembers.length &&
            <>
                <div className="members__items">
                    {filteredMembers.map((member, index) => (
                        <div className="members__item client" key={member.tickets}>
                            <h4 className="members__counter">{index + 1}.</h4>
                            <div className="members__nickname">
                                <h3 className="text__wrap">{member.nickname}</h3>
                            </div>
                            <h4 className="members__win-rate">{((100 * member.tickets) / ticketsAmount).toFixed(1)}%</h4>
                            <div className="members__tickets">
                                <h3 className="text__wrap">{member.tickets}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        }
    </>
}