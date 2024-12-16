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