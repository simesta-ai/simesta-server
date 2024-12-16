<<<<<<< HEAD
import { Request, Response } from "express"
import { RecommendationEngine } from "./recommendations.engine"
import { generateJsonSuccessResponse } from "../../../../shared/utils/generateJsonResponse"
import { catchHandlerAsync } from "../../../../shared/utils/catch-handler-async"

export class RecommendationsController {
  private recommendationEngine = new RecommendationEngine()
  public getRecommendations = catchHandlerAsync(async (req: Request, res: Response) => {
    const { userId } = req.body
    const recommendations = await this.recommendationEngine.generateRecommendations(userId)
    res.json(generateJsonSuccessResponse('Recommendations fetched successfully', recommendations))
  })
}
=======
import { Request, Response } from 'express'
import { RecommendationEngine } from './recommendations.engine'
import { generateJsonSuccessResponse } from '../../../../shared/utils/generateJsonResponse'
import { catchHandlerAsync } from '../../../../shared/utils/catch-handler-async'
import { RequestWithUser } from '../../../../types'

export class RecommendationsController {
  private recommendationEngine = new RecommendationEngine()
  public getRecommendations = catchHandlerAsync(
    async (req: RequestWithUser, res: Response) => {
      const userId = req.user?.id!
      const recommendations =
        await this.recommendationEngine.generateRecommendations(userId)
      res.json(
        generateJsonSuccessResponse(
          'Recommendations fetched successfully',
          recommendations
        )
      )
    }
  )
}
>>>>>>> 32db53b4b1e3581686e5b1966ca12a1ea6739dc9
