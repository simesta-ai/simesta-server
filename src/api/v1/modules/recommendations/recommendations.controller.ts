import { Request, Response } from "express"
import { RecommendationEngine } from "./recommendation.engine"

export class RecommendationController {
  private recommendationEngine = new RecommendationEngine()
  async getRecommendations(req: Request, res: Response) {
    const userId = req.user?.id!
    const recommendations = await this.recommendationEngine.generateRecommendations(userId)
    res.json({ recommendations })
  }
}