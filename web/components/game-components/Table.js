import React from 'react';

// style
import Style from "./PokerGameQuiz.module.css";

// my components
import TableCard from "./TableCard";

const Table = ({ card1, card2, card3, card4, card5 }) => {
    return (
        <div className={Style.TableContainer}>
            <img className={Style.TableImg} src='/game_resources/table_1.png' alt='poker table image'/>
            <div className={Style.TableCardsContainer}>
                <TableCard imgSrc={`/game_resources/cards/${card1}.png`}/>
                <TableCard imgSrc={`/game_resources/cards/${card2}.png`}/>
                <TableCard imgSrc={`/game_resources/cards/${card3}.png`}/>
                <TableCard imgSrc={`/game_resources/cards/${card4}.png`}/>
                <TableCard imgSrc={`/game_resources/cards/${card5}.png`}/>
            </div>
        </div>
      );
}
 
export default Table;