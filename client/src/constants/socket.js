import io from 'socket.io-client'
import rootDomain from './baseURL';

const socket = io.connect(rootDomain)

export default socket