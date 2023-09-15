import { useEffect, useState } from "react";


export const Timer = ({ date_time }) => {
  const targetDate = new Date(date_time);
  const calculateTimeRemaining = () => {
    const currentTime = new Date();
    const timeDifference = targetDate - currentTime;

    if (timeDifference <= 0) {
      return { hours: '00', minutes: '00', seconds: '00', finished: true }
    } else {
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

      return { hours: formattedHours, minutes: formattedMinutes, seconds: formattedSeconds };
    }
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining();
      if (newTimeRemaining.finished) {
        clearInterval(timerInterval);
        setTimeRemaining({ hours: '00', minutes: '00', seconds: '00' });
      } else {
        setTimeRemaining(newTimeRemaining);
      }
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  return <>
    <h3 className="raffle__time-time">{timeRemaining.hours}:{timeRemaining.minutes}:{timeRemaining.seconds}</h3>
  </>
}