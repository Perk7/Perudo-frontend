import { useNavigate } from "react-router-dom";
import { HiOutlineArrowUturnRight } from "react-icons/hi2";

import { Room } from 'types';

import styles from './styles.module.scss';

interface props {
    room: Room
}

export default function ButtonRoomComeback({ room }: props) {
    const navigate = useNavigate();

    function handleJoinRoom() {
        if (!room) return
        navigate(`/room/${room.name}/${room.password}`);
    };

    return (
        <button className={styles.comeBack__button} onClick={handleJoinRoom}>
            <span className={styles.comeBack__title}>Вернуться</span>
            <span className={styles.comeBack__icon}><HiOutlineArrowUturnRight /></span>
            <div className={styles.comeBack__roominfoBlock}>
                <span className={styles.comeBack__roomName}>{room.name}</span>
                <span className={styles.comeBack__roomNumber}>{Object.keys(room.players).length - 1}/{room.number}</span>
            </div>
        </button>
    );
}
