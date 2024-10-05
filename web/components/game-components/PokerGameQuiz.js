"use client";

import React, { useState, useEffect  } from 'react';

// context
import PokerGameQuizContext from './PokerGameQuizContext';

// my components
import Table from "./Table";
import Player from "./Player";

//style
import Style from "./PokerGameQuiz.module.css";

// poker odds
import { TexasHoldem } from 'poker-odds-calc';

// game
import { deck } from './gameData.js' // importing deck tha

import Timer from './Timer/Timer';
import { set } from '@coral-xyz/anchor/dist/cjs/utils/features';
import Result from './Result';

import UsernameModal from './UsernameModal';

import pocketbase from '../../app/pocketbase/pocketbase'
import { useWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';

const PokerGameQuiz = () => {
    // shuffle deck

    // deck used for calculating odds - table cards
    let oddsDeckTable = ['', '', '', '', ''];

    // deck used for calculating odds - players cards
    let oddsDeckPlayers = ['', '', '', ''];

    // deck used for displaying cards on the table
    const [displayedDeck, setDisplayedDeck] = useState(['', '', '', '', '', '', '', '', '']);
    
    // number of cards on the table
    let numberOfCards = 0;

    const [startQuizIsVisible, setStartQuizIsVisible] = useState(true);
    const [isResultVisible, setIsResultVisible] = useState(false);

    const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
    const wallet = useWallet();

    // username
    const [username, setUsername] = useState('');

    //game data
    const [roundCounter, setRoundCounter] = useState(1);
    const [score, setScore] = useState(0);

    // history
    const [history, setHistory] = useState([]);
    // default point
    const points = 99;
    
    const result ={
        round: 0,
        playerOneChance: 0.5,
        playerTwoChance: 0.5,
        correct: 1,
        winner: 0,
        score: 1,
        tableCards: ['Kh', 'Kc', '8h', '8s', '8c'],
        playerOneCards: ['Ks', '8s'],
        playerTwoCards: ['Kh', '8c']
    }


    // saving player's odds
    const [playerOneChance, setPlayerOneChance] = useState(0);
    const [playerTwoChance, setPlayerTwoChance] = useState(0);

    // game state
    const [quizIsRunning, setQuizIsRunning] = useState(true);

    const handleUsernameSubmit = async (username) => {

        // Push username database
        await pocketbase.collection('users').create({
            username: username,
            score: 0,
            wallet_address: wallet.publicKey.toBase58(),
        });

        setUsername(username);

        setIsUsernameModalVisible(false);
    }

    const startQuiz = () => {

        if (!wallet.publicKey) {     
            toast.error('Please connect your wallet to start the quiz');
            return
        }

        // quiz is running - state
        setQuizIsRunning(true);

        setStartQuizIsVisible(false);
        // initialize game
        setRoundCounter(0);

        // reset score to 0
        setScore(0);
        
        // generate first hand - round
        generateHand();

        // saving round number
        result.round = roundCounter;
    }

    const generateDeck = () => {
        // shuffle deck
        const tempDeck = deck.sort(() => Math.random() - 0.5);
    
        // generate number of table cards
        const numbers = [0, 3, 4, 5];
        const randomIndex = Math.floor(Math.random() * numbers.length);
        numberOfCards = numbers[randomIndex];
    
        // local state for displayed deck
        let updatedDisplayedDeck = ['', '', '', '', '', '', '', '', ''];
    
        // displayed deck - values are used to display cards on the table
        // odds deck - values are used to calculate odds
        if(numberOfCards === 3){
            updatedDisplayedDeck = [
                tempDeck[0], tempDeck[1], tempDeck[2], 'card_back', 'card_back',
                tempDeck[5], tempDeck[6], tempDeck[7], tempDeck[8]
            ];

            // setting up result object that is later added to history - used to display all results
            result.tableCards = [tempDeck[0], tempDeck[1], tempDeck[2], 'card_back', 'card_back'];
            result.playerOneCards = [tempDeck[5], tempDeck[6]];
            result.playerTwoCards = [tempDeck[7], tempDeck[8]];

    
            oddsDeckTable.length = 3;
            oddsDeckTable[0] = tempDeck[0];
            oddsDeckTable[1] = tempDeck[1];
            oddsDeckTable[2] = tempDeck[2];
    
            oddsDeckPlayers[0] = tempDeck[5];
            oddsDeckPlayers[1] = tempDeck[6];
            oddsDeckPlayers[2] = tempDeck[7];
            oddsDeckPlayers[3] = tempDeck[8];
    
        } else if(numberOfCards === 4){
            updatedDisplayedDeck = [
                tempDeck[0], tempDeck[1], tempDeck[2], tempDeck[3], 'card_back',
                tempDeck[5], tempDeck[6], tempDeck[7], tempDeck[8]
            ];

            // setting up result object that is later added to history - used to display all results
            result.tableCards = [tempDeck[0], tempDeck[1], tempDeck[2], tempDeck[3], 'card_back'];
            result.playerOneCards = [tempDeck[5], tempDeck[6]];
            result.playerTwoCards = [tempDeck[7], tempDeck[8]];
    
            oddsDeckTable.length = 4;
            oddsDeckTable[0] = tempDeck[0];
            oddsDeckTable[1] = tempDeck[1];
            oddsDeckTable[2] = tempDeck[2];
            oddsDeckTable[3] = tempDeck[3];
    
            oddsDeckPlayers[0] = tempDeck[5];
            oddsDeckPlayers[1] = tempDeck[6];
            oddsDeckPlayers[2] = tempDeck[7];
            oddsDeckPlayers[3] = tempDeck[8];
    
        } else if(numberOfCards === 5){
            updatedDisplayedDeck = [
                tempDeck[0], tempDeck[1], tempDeck[2], tempDeck[3], tempDeck[4],
                tempDeck[5], tempDeck[6], tempDeck[7], tempDeck[8]
            ];

            // setting up result object that is later added to history - used to display all results
            result.tableCards = [tempDeck[0], tempDeck[1], tempDeck[2], tempDeck[3], tempDeck[4]];
            result.playerOneCards = [tempDeck[5], tempDeck[6]];
            result.playerTwoCards = [tempDeck[7], tempDeck[8]];
    
            oddsDeckTable.length = 5;
            oddsDeckTable[0] = tempDeck[0];
            oddsDeckTable[1] = tempDeck[1];
            oddsDeckTable[2] = tempDeck[2];
            oddsDeckTable[3] = tempDeck[3];
            oddsDeckTable[4] = tempDeck[4];
    
            oddsDeckPlayers[0] = tempDeck[5];
            oddsDeckPlayers[1] = tempDeck[6];
            oddsDeckPlayers[2] = tempDeck[7];
            oddsDeckPlayers[3] = tempDeck[8];
        } else if(numberOfCards === 0){
            updatedDisplayedDeck = [
                'card_back', 'card_back', 'card_back', 'card_back', 'card_back',
                tempDeck[5], tempDeck[6], tempDeck[7], tempDeck[8]
            ];

            // setting up result object that is later added to history - used to display all results
            result.tableCards = ['card_back', 'card_back', 'card_back', 'card_back', 'card_back'];
            result.playerOneCards = [tempDeck[5], tempDeck[6]];
            result.playerTwoCards = [tempDeck[7], tempDeck[8]];
    
            oddsDeckTable.length = 0;
    
            oddsDeckPlayers[0] = tempDeck[5];
            oddsDeckPlayers[1] = tempDeck[6];
            oddsDeckPlayers[2] = tempDeck[7];
            oddsDeckPlayers[3] = tempDeck[8];
        }
    
        // Update the displayedDeck state using setDisplayedDeck
        setDisplayedDeck(updatedDisplayedDeck);
    };

    const generateHand = () => {
        // generate new deck
        generateDeck();

        // calculate odds
        const Table = new TexasHoldem();
        Table
            .addPlayer([oddsDeckPlayers[0], oddsDeckPlayers[1]])
            .addPlayer([oddsDeckPlayers[2], oddsDeckPlayers[3]])
        
        if(numberOfCards != 0){ 
            Table.setBoard(oddsDeckTable);
        }
        const Result = Table.calculate();
        

        Result.getPlayers().forEach(player => {
            console.log(`${player.getName()} - ${player.getHand()} - Wins: ${player.getWinsPercentageString()} - Ties: ${player.getTiesPercentageString()}`);
            // set player 1 chance
            if(player.getName() === 'Player #1'){
                setPlayerOneChance(player.getWinsPercentageString());
            }
            // set player 2 chance 
            else if(player.getName() === 'Player #2') {
                setPlayerTwoChance(player.getWinsPercentageString());
            } 
            // handle error
            else {
                console.log('error - wrong name');
            }

        });
    }

    const nextRound = () => {
        const tempRoundCounter = roundCounter;
        if(roundCounter != 10){
            // increase round counter
            setRoundCounter(roundCounter + 1);
            
            // generate new deck
            generateHand();

        }
        // end quiz and show result
        if(tempRoundCounter === 9) {
            // show result
            setIsResultVisible(true);

            // set quiz state to false and stop timer
            setQuizIsRunning(false);
        }
    }

    const addNewHistoryElement = (newElement) => {
        // adding new element
        setHistory((prevHistory) => [...prevHistory, newElement]);
    }
    

    useEffect(() => {

        const checkAddressInPocketBase = async () => {
            // Check in pocket base is there username associated with the wallet address currently in use
            try {

                const records = await pocketbase.collection('users').getFirstListItem(
                    `wallet_address='${wallet.publicKey.toBase58()}'`
                );

                setUsername(records.username);
                
                setIsUsernameModalVisible(false);
              } catch (err) {
                // setError('Failed to fetch users. Please try again.');
                setIsUsernameModalVisible(true);
              }
        }

        if (wallet.publicKey){
            checkAddressInPocketBase();
        }

    }, [wallet.publicKey, startQuizIsVisible]); // Moved the closing bracket for the callback function here
    

    return ( 
        <PokerGameQuizContext.Provider value={{
            playerOneChance, 
            playerTwoChance,
            nextRound,
            score,
            setScore,
            quizIsRunning,
            result,
            history,
            addNewHistoryElement,
            setIsResultVisible,
            setHistory,
            setRoundCounter,
            setQuizIsRunning,
            points
            }}>
            <div className={Style.GameContainer}>
                <div className={Style.GameHeader}>
                    <div style={{fontSize: '1.5em', marginTop: '2.5em'}}>{`${roundCounter+1}/10`}</div>
                </div>
                <div className={Style.TimeCounter}>
                        {!startQuizIsVisible && <Timer/>}
                </div>
                <div className={Style.Question}>Who has higher chance to win?</div>
                <Table card1={displayedDeck[0]} card2={displayedDeck[1]} card3={displayedDeck[2]} card4={displayedDeck[3]} card5={displayedDeck[4]}/>
                <Player card1={displayedDeck[5]} card2={displayedDeck[6]} card3={displayedDeck[7]} card4={displayedDeck[8]}/>

                {startQuizIsVisible && 
                    <div className={Style.StartQuizContainer}>
                        <div className={Style.WelcomeTitle}>Welcome {username}!</div>
                        <button onClick={startQuiz} className={Style.StartQuizButton}>START QUIZ</button>
                    </div>
                }

                {isResultVisible && <Result/>}
                {isUsernameModalVisible && <UsernameModal handleUsernameSubmit={handleUsernameSubmit}/>}

            </div>
        </PokerGameQuizContext.Provider>
     );
}
 
export default PokerGameQuiz;