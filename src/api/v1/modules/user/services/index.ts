/**
 * @file user/services/index.ts
 * @author [Kingsley Ihemelandu]
 * @github [https://github.com/kijuchihe]
 * @description Defines the user services for the application.
 * @created [2024-07-20]
 * @lastModified [2024-07-20]
 * @module api/v1/modules/user
 */
import { ideahub_v1alpha } from 'googleapis'
import UserRepository from '../repository'

const userRepository = new UserRepository()

class UserService {
    async getUserById(id: string) {
        return await userRepository.findById(id)
    }
 }

export default UserService
