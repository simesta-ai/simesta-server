import { io } from '../../../../../app'
import AIMessenger from './aimessaging';


const aiMessenger = new AIMessenger()


class SocketController {
  private socket;
  constructor(socket: any) {
    this.socket = socket
  }
  public initializeMessaging() {
    io.emit('simesta message', "Hi there, welcome to simesta.")
    this.socket.on('chat message', async (msg: string) => {
      io.emit('simesta message', await aiMessenger.chat(msg))
    })
  }
}

export default SocketController
