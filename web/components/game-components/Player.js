import React, { useContext } from 'react';

// stlye 
import Style from "./PokerGameQuiz.module.css";

// my components
import Option from "./Option";

// context 
import PokerGameQuizContext from './PokerGameQuizContext';

const Player = ({ card1, card2, card3, card4}) => {

    const { playerOneChance, playerTwoChance, setPlayerOneChance, setPlayerTwoChance } = useContext(PokerGameQuizContext);

    const handleOptionOneClick = () => {

    }

    const handleOptionTwoClick = () => {

    }

    return (
        <div className={Style.PlayerContainer}>
            <Option imgSrc1={`/game_resources/cards/${card1}.png`} imgSrc2={`/game_resources/cards/${card2}.png`} isPlayerOne={true} isPlayerTwo={false}/>
            <Option imgSrc1={`/game_resources/cards/${card3}.png`} imgSrc2={`/game_resources/cards/${card4}.png`} isPlayerOne={false} isPlayerTwo={true}/>
        </div>
      );
}
 
export default Player;