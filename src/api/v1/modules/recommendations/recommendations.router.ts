import express from "express"
import { RecommendationsController } from "./recommendations.controller"
const recommendationsRouter = express.Router()

const recommendationsController = new RecommendationsController()

recommendationsRouter.get('/', recommendationsController.getRecommendations)

export default recommendationsRouter