import prisma from '../../../../../config/db/prisma'

class PreferenceRepository {
  model = prisma.preference

  setSpeechPreference = async (
    speechSythesisVoiceName: string,
    userId: string
  ) => {
    return await this.model.update({
      where: {
        userId,
      },
      data: {
        speech_sythesis_voice_name: speechSythesisVoiceName,
      },
    })
  }
  getUserPreference = async (userId: string) => {
    return await this.model.findUnique({
      where: {
        userId,
      },
    })
  }
}

export default PreferenceRepository
