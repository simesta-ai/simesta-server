import { Request, Response } from "express"
import { RecommendationEngine } from "./recommendations.engine"
import { generateJsonSuccessResponse } from "@/shared/utils/generateJsonResponse"

export class RecommendationsController {
  private recommendationEngine = new RecommendationEngine()
  public getRecommendations = async (req: Request, res: Response) => {
    const userId = req.user?.id!
    const recommendations = await this.recommendationEngine.generateRecommendations(userId)
    res.json(generateJsonSuccessResponse('Recommendations fetched successfully', recommendations))
  }
}