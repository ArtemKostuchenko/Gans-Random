import { useEffect, useState } from 'react';
import FlipMove from 'react-flip-move';
import { Member } from './Member';

export const MembersAdmin = ({ members, filteredMembers, ticketsAmount, setMembers, setTicketsAmount }) => {
    const [sortedMembers, setSortedMembers] = useState([]);
    
    useEffect(() => {
        const sorted = members.slice().sort((a, b) => b.tickets - a.tickets);
        setSortedMembers(sorted);
    }, [members]);

    return <>
        {members.length === filteredMembers.length &&
            <>
                <div className="members__items">
                    <FlipMove duration={550} enterAnimation="fade" leaveAnimation="fade" >
                        {sortedMembers.map((member, index) => (
                            <div className="members__item" key={member.id + member.tickets}>
                                <Member index={index} member={member} members={members} setMembers={setMembers} ticketsAmount={ticketsAmount} setTicketsAmount={setTicketsAmount} />
                            </div>
                        )
                        )}
                    </FlipMove>
                </div>
            </>
        }
        {members.length !== filteredMembers.length &&
            <>
                <div className="members__items">
                    {filteredMembers.map((member, index) => (
                        <div className="members__item" key={member.tickets}>
                            <Member index={index} member={member} members={members} setMembers={setMembers} ticketsAmount={ticketsAmount} setTicketsAmount={setTicketsAmount} />
                        </div>
                    )
                    )}
                </div>
            </>
        }

    </>
}