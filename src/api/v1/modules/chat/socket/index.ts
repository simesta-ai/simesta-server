/*
 * @file socket/index.ts
 * @author [Emeka Samuel]
 * @github [https://github.com/samthemogul]
 * @description Implementation for user-ai chat to determine learning method.
 * @created [2024-09-09]
 * @lastModified [2024-09-15]
 * @module api/v1/modules/chat
 */

import { io } from '../../../../../app'
import AIMessenger from './aimessaging';


const aiMessenger = new AIMessenger()


class SocketController {
  private socket;
  constructor(socket: any) {
    this.socket = socket
  }
  public async initializeMessaging() {
    this.socket.on('start prediction', async (msg: string) => {
      io.emit('simesta message', await aiMessenger.startLearningStylePrediction(msg))
    })
    this.socket.on('user lecture chat', async (msg: string) => {
      io.emit('simesta message', await aiMessenger.chat(msg))
    })
    this.socket.on('chat message', async (msg: string) => {
      io.emit('simesta message', await aiMessenger.chat(msg))
    })
  }
}

export default SocketController
