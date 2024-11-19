import { connect } from "socket.io-client";

const url = process.env.REACT_APP_SERVER_URL
const webSocket = connect(url);

export default webSocket