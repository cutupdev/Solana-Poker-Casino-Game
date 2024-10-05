import React, { useState, useEffect, useContext } from 'react';

// context
import PokerGameQuizContext from '../PokerGameQuizContext';

const Timer = ({ initialSeconds = 60, onTimeout }) => {

  const [seconds, setSeconds] = useState(initialSeconds);
  const { quizIsRunning } = useContext(PokerGameQuizContext);

  const { setIsResultVisible, timeLeft, setTimeLeft } = useContext(PokerGameQuizContext);

  useEffect(() => {

    let interval;

    if (quizIsRunning && seconds > 0) {

      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);

        // time left
        setTimeLeft(seconds);
      }, 1000);

    }

    // clear the interval when the timer reaches 0 or the quiz stops running
    if (seconds === 0) {
        // clear interval
        clearInterval(interval);

        // show result
        setIsResultVisible(true);
      
        // call the onTimeout callback when the timer reaches 0
        if (onTimeout) {
            onTimeout();
        }

    }

    return () => clearInterval(interval);
  }, [quizIsRunning, seconds, onTimeout]);

  // reset the timer if the quiz starts again
  useEffect(() => {
    if (!quizIsRunning) {
      setSeconds(initialSeconds);
    }
  }, [quizIsRunning, initialSeconds]);

  return <div style={{ fontSize: '0.9em' }}>{seconds}s</div>;
};

export default Timer;
