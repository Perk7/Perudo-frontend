import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";

import { Room as RoomType, UserGame, initialRoom } from 'types';
import webSocket from 'socket';

import PlayersList from './PlayersList';
import BidBLock from './BidBlock';

import { dicesIndexes } from './BidBlock';
import styles from './styles.module.scss';

export default function Room() {
    const navigate = useNavigate();
    const [gameState, setGameState]: [RoomType, Function] = useState(initialRoom);

    const [currentBid, setCurrentBid] = useState({ count: 1, value: 0 });
    const [notificationPrestart, setNotificationPrestart] = useState('')
    const [errorNotification, setErrorNotification] = useState('')
    const [notificationGame, setNotificationGame] = useState('')
    const [endRound, setEndRound] = useState(false)
    
    const {name, password} = useParams();

    const userName = localStorage.getItem('playerName') 
    const userId = parseInt(localStorage.getItem('playerId') || '1')

    useEffect(() => {
        if (!name) return;
        if (!userName || !userId) {
            navigate('/');
            return
        }

        webSocket.on('room', (data) => { 
            if (data.room.game && !data.room.game.currentBid && data.room.game.players.length !== 1
                && 
                (data.room.game.players.length !== data.room.number 
                    || 
                data.room.game.players.reduce((acc: number, player: UserGame) => acc + player.diceCount, 0) !== data.room.game.players.length*5
                )
            ) {
                setTimeout(() => {
                    setGameState(data.room)
                    setEndRound(false)
                }, 8000)
            } else 
                setGameState(data.room)
            if (data.room.game?.currentBid?.value > 0) {
                setCurrentBid({...data.room.game.currentBid, value: dicesIndexes.indexOf(data.room.game.currentBid.value)})
            }
        });

        webSocket.on('restart', (data) => {
            setGameState(data.room)
        });

        webSocket.on('forbidden', () => {
            setErrorNotification('Неверный пароль от комнаты');
        });
        webSocket.on('error', (data) => {
            setErrorNotification(data.message);
        });

        webSocket.on('prestart', () => {
            setEndRound(false)
            setNotificationPrestart(`Игра начнется в течение 5ти секунд...`);
            setNotificationGame(``);
            setTimeout(() => setNotificationPrestart(''), 5000);
        });
 
        webSocket.on('raised', (data) => {
            setNotificationGame(`Ставка поднята, следующий ход: ${data.nextPlayer.name}`)
        });
        webSocket.on('endRound', (data) => {
            setEndRound(true)
            setTimeout(() => setNotificationGame(`Количество костей на доске: ...`), 1000)
            setTimeout(() => setNotificationGame(`Количество костей на доске: ${data.totalCount}`), 4000)
            setTimeout(() => setNotificationGame(`${data.user.name} теряет одну кость, следующий ход: ${data.nextPlayer.name}`), 6000)
            setCurrentBid({count: 1, value: 0})
        });
        webSocket.on('loose', (data) => {
            setEndRound(true)
            setTimeout(() => setNotificationGame(`Количество костей на доске: ...`))
            setTimeout(() => setNotificationGame(`Количество костей на доске: ${data.totalCount}`), 4000)
            setTimeout(() => setNotificationGame(`${data.user.name} проиграл, следующий ход: ${data.nextPlayer.name}`), 6000)
        });
        webSocket.on('win', (data) => {
            setEndRound(true)
            setTimeout(() => setNotificationGame(`Количество костей на доске: ...`))
            setTimeout(() => setNotificationGame(`Количество костей на доске: ${data.totalCount}`), 4000)
            setTimeout(() => setNotificationGame(`Победитель партии: ${data.user.name}`), 6000)
        });

        webSocket.emit('joinRoom', { name, password, player: { name: userName, id: userId } });

        return () => {
            webSocket.emit('leaveDelay', { name, id: userId })
            
            webSocket.off('room');
            webSocket.off('restart');
            webSocket.off('forbidden');
            webSocket.off('error');
            webSocket.off('prestart');
            webSocket.off('raised');
            webSocket.off('endRound');
            webSocket.off('loose');
            webSocket.off('win');
        };
    }, []);

    function checkWatcherMode() {
        return !!(gameState.game && !gameState.game.players.flatMap(user => user.id).includes(userId))
    }

    return (
        <div className={styles.mainBlock}>
        <div className={styles.snow}></div>
        {errorNotification
            ? <h1 className={styles.errorMainTitle}>{errorNotification}</h1>
            : <>
                <header className={styles.header}>
                    <div className={styles.header__room}><strong>{name}</strong></div>
                    <div className={styles.header__logoutBlock}>
                        {checkWatcherMode() && (<>
                            <FaEye />
                            <h2>Режим наблюдения</h2> 
                        </>)}
                        <Link to='/'>Выйти</Link>
                    </div>
                </header>

                <PlayersList gameState={gameState} />
                <div className={styles.prestartTitle}>{notificationGame}</div>

                {gameState.game && !endRound
                    ?  <BidBLock 
                            gameState={gameState} 
                            watcherStatus={checkWatcherMode()} 
                            currentBid={currentBid} 
                            setCurrentBid={setCurrentBid}
                       />
                    : (<h1 className={styles.prestartTitle}>
                        {endRound 
                            ?  (<>
                                <span>Ставка: {gameState.game?.currentBid.count}</span> 
                                <img src={`/assets/dices/${gameState.game?.currentBid.value}.svg`} alt={`${dicesIndexes[currentBid.value]}`} />
                            </>)
                            : (notificationPrestart || `Ожидание начала игры`)
                        }
                       </h1>)
                }
            </>
        }
        </div>
    );
}
