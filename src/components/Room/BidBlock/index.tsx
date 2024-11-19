import { Room as RoomType } from 'types';
import webSocket from 'socket';

import styles from './styles.module.scss'

interface props {
    gameState: RoomType,
    watcherStatus: boolean,
    currentBid: {
        value: number,
        count: number
    },
    setCurrentBid: Function
}

export const dicesIndexes = [2,3,4,5,6,1]

export default function BidBLock({ gameState, watcherStatus, currentBid, setCurrentBid }: props) {
    const userId = parseInt(localStorage.getItem('playerId') || '1')

    function handleRaiseBid() {
        webSocket.emit('raiseBid', {
            roomName: gameState.name,
            bid: {...currentBid, value: dicesIndexes[currentBid.value]},
        });
    };

    function handleDoubt() {
        webSocket.emit('doubt', {
            roomName: gameState.name,
        });
    };

    function changeCount(type: string) {
        switch (type) {
            case '-':
                setCurrentBid({ 
                    ...currentBid,
                    count: Math.max(
                        gameState.game?.currentBid?.count||1, 
                        currentBid.count - 1
                    ) 
                })
                break;
            case '+':
                setCurrentBid({
                    ...currentBid, 
                    count: Math.min(
                        gameState.game?.players.reduce((prev, curr) => prev += curr.diceCount, 0)
                        ||
                        Object.keys(gameState.players).length*5, 
                        currentBid.count + 1
                    )
                })
                break;
            default:
                return;
        }
    }

    function changeValue(type: string) {
        switch (type) {
            case '-':
                setCurrentBid({ 
                    ...currentBid,
                    value: Math.max(
                        dicesIndexes.indexOf(gameState.game?.currentBid?.value||2), 
                        currentBid.value - 1
                    ) 
                })
                break;
            case '+':
                setCurrentBid({
                    ...currentBid, 
                    value: Math.min(
                        5, 
                        currentBid.value + 1
                    )
                })
                break;
            default:
                return;
        }
    }

    function doubtDisabledStatus() {
        return !(gameState.game?.currentBid?.count && gameState.game?.currentBid?.value)
    }

    function raiseDisabledStatus() {
        if (!gameState.game?.currentBid) return false
        return currentBid.count <= gameState.game.currentBid.count && currentBid.value <= dicesIndexes.indexOf(gameState.game.currentBid.value)
    }

    if (!gameState.game) return null
    return (
        <div className={styles.gameBlock}>
            {gameState.game.currentBid &&
                <h2 className={styles.gameInfoTitle}>
                    Текущая ставка: <strong>{gameState.game.currentBid.count}</strong>
                    <img className={styles.diceImage} src={`/assets/dices/${gameState.game.currentBid.value}.svg`} alt="" />
                </h2>
            }

            {!watcherStatus &&
            <div className={styles.gameInfoTitle}>
                <span>Кости:</span>
                <div>
                    {gameState.game.players.find(player => player?.id === userId)?.dices.map(dice => 
                        <img className={styles.diceImage} src={`/assets/dices/${dice}.svg`} alt={`${dice}`} />
                    )}
                </div>
            </div>}

            {gameState.game.players[gameState.game.currentPlayer]?.id === userId && (
                <>
                    <h3 className={styles.stepTitle}>Ваш ход</h3>

                    <section className={styles.roomBid__fields}>
                        <div className={styles.roomBid__fields__block}>
                            <button  
                                disabled={
                                    (gameState.game.currentBid?.count === currentBid.count) ||
                                    (currentBid.count === 1)
                                } 
                                onClick={() => changeCount('-')}
                            >-</button>
                            <span>{currentBid.count}</span>
                            <button 
                                disabled={
                                    gameState.game.players.reduce((prev, curr) => prev += curr.diceCount, 0) === currentBid.count
                                } 
                                onClick={() => changeCount('+')}
                            >+</button>
                        </div>

                        <div className={styles.roomBid__fields__block}>
                            <button 
                                disabled={(currentBid.value === 0) || (dicesIndexes[currentBid.value] === gameState.game.currentBid?.value)}
                                onClick={() => changeValue('-')}
                            >-</button>
                            <img src={`/assets/dices/${dicesIndexes[currentBid.value]}.svg`} alt={`${dicesIndexes[currentBid.value]}`} />
                            <button 
                                disabled={(currentBid.value === 5)}
                                onClick={() => changeValue('+')}
                            >+</button>
                        </div>
                    </section>

                    <div className={styles.roomBid__btns}>
                        <button disabled={raiseDisabledStatus()} onClick={handleRaiseBid}>Сделать ставку</button>
                        <button disabled={doubtDisabledStatus()} onClick={handleDoubt}>Не верю</button>
                    </div>
                </>
            )}
        </div>
    );
}
