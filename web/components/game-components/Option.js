import React, { useContext } from 'react';

// style 
import Style from "./PokerGameQuiz.module.css";

// context
import PokerGameQuizContext from './PokerGameQuizContext';

const Option = ({ imgSrc1, imgSrc2, isPlayerOne, isPlayerTwo }) => {

    const { playerOneChance, playerTwoChance, nextRound, score, setScore, result, points, addNewHistoryElement, roundCounter } = useContext(PokerGameQuizContext);

    const handleOptionClick = () => {
        // remove all ~ and % from the string and parse it to float
        const parsedChanceOne = parseFloat(playerOneChance.replace(/[~%]/g, ''));
        const parsedChanceTwo = parseFloat(playerTwoChance.replace(/[~%]/g, ''));

        // result - history - saving player chances
        result.playerOneChance = playerOneChance;
        result.playerTwoChance = playerTwoChance;

        if(isPlayerOne){
            if(parsedChanceOne > parsedChanceTwo) {
                console.log('YOU WON!');
                setScore(score + points)

                // save result
                result.winner = 0;
                result.correct = true;
                result.score = points;
                result.round = roundCounter;
                
                // add result to history
                addNewHistoryElement(result);

            } else {
                console.log('YOU LOST!');
                setScore(score)

                // save result
                result.winner = 1;
                result.correct = 0;
                result.score = 0;
                
                // add result to history
                addNewHistoryElement(result);
            }

            nextRound();

        } else if(isPlayerTwo){
            console.log('player 2 chance to win');
            if(parsedChanceTwo > parsedChanceOne){
                console.log('YOU WON!');
                setScore(score + points)

                // save result
                result.winner = 1;
                result.correct = 1;
                result.score = points;
                
                // add result to history
                addNewHistoryElement(result);

            } else {
                console.log('YOU LOST!');
                setScore(score)

                // save result
                result.winner = 0;
                result.correct = 0;
                result.score = 0;
                
                // add result to history
                addNewHistoryElement(result);
            }

            nextRound();
        }
    }

    return (
        <div onClick={() => handleOptionClick()} className={Style.OptionContainer}>
            <img 
                className={Style.OptionCardLeft} 
                src={imgSrc1} alt='player_card1'
                onError={(e) => e.target.src = './game_resources/cards/card_back.png'}    
            />
            <img 
                className={Style.OptionCardRight} 
                src={imgSrc2} alt='player_card2'
                onError={(e) => e.target.src = './game_resources/cards/card_back.png'}
            />
        </div>
      );
}
 
export default Option;