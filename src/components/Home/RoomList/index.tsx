import { useState, useEffect } from 'react';

import { Room } from 'types';
import webSocket from 'socket';

import ModalCreateRoom from './ModalCreateRoom';
import ModalJoinRoom from './ModalJoinRoom';

import styles from './styles.module.scss';
import ButtonRoomComeback from './ButtonRoomComeback';

interface props {
    authorized: boolean
}

export default function RoomList({ authorized }: props) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomToComeback, setRoomToComeback] = useState<Room|null>(null);

    const [selectedRoom, selectRoom] = useState<Room|null>(null)
    const [isCreateModalActive, changeCreateModalActive] = useState(false)
    const [searchRoom, setSearchRoom] = useState('')
        
    const localId = localStorage.getItem('playerId')
    const nick = localStorage.getItem('playerName') 

    useEffect(() => {
        if (!authorized) return

        if (localId && nick) {
            webSocket.emit('watch', +localId);
        }

        webSocket.on('list', (data) => {
            setRooms(data.rooms);
            setRoomToComeback(getRoomToComeback(data.rooms))
        });

        return () => { webSocket.off('list') }
    }, [authorized]);

    function getAvaliableRooms(): Room[] {
        if (!localId) return []
        const avaliableRooms: Room[] = []

        for (let room of rooms) {
            if (!room.game 
                    && 
                !(Object.keys(room.players).length === room.number) 
                    && 
                !Object.keys(room.players).includes(localId))
                
                if (!searchRoom || (searchRoom && room.name.includes(searchRoom)))
                    avaliableRooms.push(room)
        }

        return avaliableRooms
    }

    function getRoomToComeback(allRooms: Room[]): Room|null {
        if (!localId || !allRooms.length) return null
        for (let room of allRooms) {
            if (Object.keys(room.players).includes(localId))
                return room
        }
        return null
    }

    return (
        <section className={styles.roomList__block}>
            {(!selectedRoom && !isCreateModalActive) && (<>
            {roomToComeback && <ButtonRoomComeback room={roomToComeback} />}

            <input
                type="text" name="room" placeholder="Поиск" maxLength={20} className={styles.roomList__searchField}
                value={searchRoom} onChange={e => setSearchRoom(e.target.value)}
            />
            <button className={styles.roomList__createBtn} onClick={() => changeCreateModalActive(true)}>Создать комнату</button>
            
            {!getAvaliableRooms().length &&
                <h2 className={styles.roomList__title}>
                {searchRoom
                    ? 'Комнат не найдено'
                    : 'Доступных комнат нет'}
                </h2>
            }

            <ul className={styles.roomList__list}>
                {getAvaliableRooms().map((room: Room) => (
                    <li key={room.name}>
                        <button onClick={() => selectRoom(room)}>
                            <span className={styles.roomList__roomName}>{room.name}</span>
                            <span className={styles.roomList__roomNumber}>
                                {room.probs && <span className={styles.roomList__probsVisible} >%</span> }
                                {Object.keys(room.players).length}/{room.number}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
            </>)}

            {selectedRoom && 
                <ModalJoinRoom 
                    closeModal={() => selectRoom(null)} 
                    room={selectedRoom}
                />
            }
            {isCreateModalActive && 
                <ModalCreateRoom 
                    roomsNames={rooms.flatMap((room: Room) => room.name)} 
                    closeModal={() => changeCreateModalActive(false)} 
                />
            }
        </section>
    );
}
