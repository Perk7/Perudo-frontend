import { useState, useEffect } from 'react';

import RoomList from './RoomList';
import Auth from './Auth';

import styles from './styles.module.scss'

export default function Home() {
    const [authorized, setAuthorized] = useState(false)
    const [loading, setLoading] = useState(true)
    
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        const localId = localStorage.getItem('playerId')
        const nick = localStorage.getItem('playerName') 

        if (localId && nick) {
            setNickname(nick)
            if (!authorized)
                setAuthorized(true)
        }
        
        if (loading)
            setLoading(false)

    }, [authorized]);

    function logout(): void {
        localStorage.removeItem('playerId')
        localStorage.removeItem('playerName')

        setAuthorized(false)
    }

    return (
        <div className={styles.mainBlock}>
            <header className={styles.header}>
                <h1>Перудо</h1>
                {authorized && <div className={styles.headerLogoutBlock}>
                    <strong>{nickname}</strong>
                    <button onClick={logout}>Выйти</button>
                </div>}
            </header>

            <main>
            {loading 
                ? <h2 className={styles.loadPendingTitle}>Загрузка...</h2> 
                : authorized 
                    ? <RoomList authorized={authorized} /> 
                    : <Auth authStatusHandler={setAuthorized} />   
            }
            </main>
        </div>
    );
}
