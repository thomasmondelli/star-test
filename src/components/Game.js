import { useEffect, useState } from "react";
import React from "react";
import utils from "../math-utils";
import Stars from "./Stars";
import NumberDisplay from "./NumberDisplay";
import PlayAgain from "./PlayAgain";

const useGameState = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNumbers, setAvailableNumbers] = useState(utils.range(1, 9));
  const [candidateNumbers, setCandidateNumbers] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if (availableNumbers.length > 0 && secondsLeft > 0) {
      const timerId = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  });

  const setGameStatus = (NewCandidateNumbers) => {
    if (utils.sum(NewCandidateNumbers) !== stars) {
      setCandidateNumbers(NewCandidateNumbers);
    } else {
      const newAvailableNumbers = availableNumbers.filter(
        (n) => !NewCandidateNumbers.includes(n)
      );
      setAvailableNumbers(newAvailableNumbers);
      setCandidateNumbers([]);
      setStars(utils.randomSumIn(newAvailableNumbers, 9));
    }
  };

  return {
    stars,
    availableNumbers,
    candidateNumbers,
    secondsLeft,
    setGameStatus,
  };
};

const Game = (props) => {
  const {
    stars,
    availableNumbers,
    candidateNumbers,
    secondsLeft,
    setGameStatus,
  } = useGameState();

  const gameStatus =
    availableNumbers.length === 0
      ? "won"
      : secondsLeft === 0
      ? "lost"
      : "active";
  const isCandidate = utils.sum(candidateNumbers) < stars;

  const numberStatus = (num) => {
    if (!availableNumbers.includes(num)) {
      return "used";
    }

    if (candidateNumbers.includes(num)) {
      return isCandidate ? "candidate" : "wrong";
    }

    return "available";
  };

  const onNumClick = (num, status) => {
    if (status === "used" || secondsLeft === 0) {
      return;
    }

    const NewCandidateNums =
      status === "available"
        ? candidateNumbers.concat(num)
        : candidateNumbers.filter((n) => n !== num);

    setGameStatus(NewCandidateNums);
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== "active" ? (
            <PlayAgain gameStatus={gameStatus} onClick={props.startNewGame} />
          ) : (
            <Stars count={stars} />
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map((num) => (
            <NumberDisplay
              number={num}
              status={numberStatus(num)}
              onClick={onNumClick}
              key={num}
            />
          ))}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

export default Game;
