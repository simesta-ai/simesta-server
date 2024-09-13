import { io } from '../../../../../app'
import AIMessenger from './aimessaging';


const aiMessenger = new AIMessenger()


class SocketController {
  private socket;
  constructor(socket: any) {
    this.socket = socket
  }
  public async initializeMessaging() {
    io.emit('simesta message', await aiMessenger.startLearningStylePrediction())
    this.socket.on('chat message', async (msg: string) => {
      io.emit('simesta message', await aiMessenger.chat(msg))
    })
  }
}

export default SocketController
