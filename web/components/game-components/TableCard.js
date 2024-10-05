import React from 'react';

import Style from "./PokerGameQuiz.module.css";

const TableCard = ({ imgSrc }) => {
    return (  
            <img 
                className={Style.TableCard} 
                src={imgSrc} alt='poker table image'
                onError={(e) => e.target.src = './game_resources/cards/card_back.png'} 
            />
    );
}
 
export default TableCard;