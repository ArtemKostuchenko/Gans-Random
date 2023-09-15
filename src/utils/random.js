import random from 'random'

const shuffleMembers = (members) => {
    const shuffledMembers = [...members];
    for (let i = shuffledMembers.length - 1; i > 0; i--) {
        const j = random.int(0, i + 1);
        [shuffledMembers[i], shuffledMembers[j]] = [shuffledMembers[j], shuffledMembers[i]];
    }
    return shuffledMembers;

}

const expendByTickets = (members) => {
    const expendedArray = [];
    members.forEach((member) => {
        for (let i = 0; i < Number(member.tickets); i++) {
            expendedArray.push(member.nickname);
        }
    });
    return expendedArray;
}

export const randomizeWinners = (members) => {
    const winners = [];
    const expendedMembers = expendByTickets(members);
    let shuffledMembers = shuffleMembers(expendedMembers);
    members.forEach(() => {
        const randomInt = random.int(0, shuffledMembers.length);
        const name = shuffledMembers[randomInt]
        winners.push(members.filter(member => member.nickname === name)[0]);
        shuffledMembers = shuffledMembers.filter(nickname => nickname !== name);
    });
    return winners;
}



