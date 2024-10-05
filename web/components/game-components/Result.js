import React, { useState, useEffect, useContext } from 'react';

// style
import Style from "./PokerGameQuiz.module.css";

// context
import PokerGameQuizContext from './PokerGameQuizContext';

import { useSolanaPokerQuizProgram } from '../solana-poker-quiz/solana-poker-quiz-data-access';

// change to next route - leaderboard
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';

import pb from '../../app/pocketbase/pocketbase'
import { BN } from '@coral-xyz/anchor';

const Result = () => {

    const { score, history, setIsResultVisible, setScore, setHistory, setRoundCounter, setQuizIsRunning } = useContext(PokerGameQuizContext);

    const [isMounted, setIsMounted] = useState(false);

    const { publicKey } = useWallet();

    const { updateScore } = useSolanaPokerQuizProgram();

    // router (first check if the component is mounted)
    const router = useRouter();

    const handleTryAgainClick = () => {
        // reset game settings
        setRoundCounter(0);
        setHistory([]);
        setScore(0);
        setQuizIsRunning(true);
        setIsResultVisible(false);
    }

    const handleLeaderboardClick = () => {
        // change to leaderboard route
        if(router) {
            router.push('/leaderboard');
        }
    }

    const saveScoreToSolana = async () => {

        updateScore.mutateAsync({ user: publicKey, score: new BN(9) });

        let existingUser

        try {
            existingUser = await pb.collection('users').getFirstListItem(
                `wallet_address="${publicKey.toBase58()}"`
            );       
              console.log(existingUser)
            if (existingUser) {
                await pb.collection('users').update(existingUser.id, {
                    score: score
                });
            }
        } catch (error) {
            console.log("Error: ", error);
        }

        // save score to solana
        console.log("Save score to solana");
    }

    // when components is ounted
    useEffect(() => {
    
    }, []);

    return ( 
        <div className={Style.ResultContainer}>
            <   div className={Style.ResultModal}>
                <div className={Style.ScoreTitle}>Your score: {score}</div>
                <div className={Style.HandsResults}>
                {
                    history.map((element, index) => (
                        <div className={Style.HandContainer} key={index}>
                            <div className={Style.ResultRound}>{index + 1}</div>
                            <div className={Style.TableCards}>
                                <img src={`./game_resources/cards/${element.tableCards[0]}.png`} className={Style.HandCard}></img>
                                <img src={`./game_resources/cards/${element.tableCards[1]}.png`} className={Style.HandCard}></img>
                                <img src={`./game_resources/cards/${element.tableCards[2]}.png`} className={Style.HandCard}></img>
                                <img src={`./game_resources/cards/${element.tableCards[3]}.png`} className={Style.HandCard}></img>
                                <img src={`./game_resources/cards/${element.tableCards[4]}.png`} className={Style.HandCard}></img>
                            </div>
                            <div className={Style.PlayerOneCards}>
                                {/* DID PLAYER WIN? */}
                                {element.winner === 0 ? <div className={Style.Correct}></div> : null}
                                {/* PLAYER ONE CHANCE */}
                                <div className={Style.ResultPlayerChance}>{element.playerOneChance}</div>
                                {/* TO-DO - WHAT PLAYER SELECTED */}
                                <div className={Style.PlayerSelection}></div>
                                <div className={Style.PlayerCardResult}>
                                    <img src={`/game_resources/cards/${element.playerOneCards[0]}.png`} className={Style.HandCardPlayer}></img>
                                </div>
                                <div className={Style.PlayerCardResult}>
                                    <img src={`/game_resources/cards/${element.playerOneCards[1]}.png`} className={Style.HandCardPlayer}></img>
                                </div>
                            </div>
                            <div className={Style.PlayerTwoCards}>
                                {/* DID PLAYER WIN? */}
                                {element.winner === 1 ? <div className={Style.Correct}></div> : null}
                                {/* PLAYER TWO CHANCE */}
                                <div className={Style.ResultPlayerChance}>{element.playerTwoChance}</div>
                                {/* TO-DO - WHAT PLAYER SELECTED */}
                                <div className={Style.PlayerSelection}></div>
                                <div className={Style.PlayerCardResult}>
                                    <img src={`/game_resources/cards/${element.playerTwoCards[0]}.png`} className={Style.HandCardPlayer}></img>
                                </div>
                                <div className={Style.PlayerCardResult}>
                                    <img src={`/game_resources/cards/${element.playerTwoCards[1]}.png`} className={Style.HandCardPlayer}></img>
                                </div>
                            </div>
                            <div className={Style.ResultScore}>{element.score}</div>
                        </div>
                        
                    ))
                }

                </div>
                <div className={Style.ResultButtonsContainer}>
                    <button onClick={() => handleLeaderboardClick()} className={Style.LeaderboardButton}>Leaderboard</button>
                    <button onClick={() => handleTryAgainClick()} className={Style.TryAgainButton}>Try again</button>
                    <button onClick={() => saveScoreToSolana()} className={Style.SaveToSolanaButton}>Save score</button>

                </div>
            </div>
        </div>
     );
}
 
export default Result;