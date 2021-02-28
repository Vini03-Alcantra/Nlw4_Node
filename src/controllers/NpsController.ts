import {Request, Response} from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
    /**
        Detratores => 0 - 6
        Passivos => 7-8
        Promottores => 9-10
        
        (Número de promotores - número de detratores) / (número de respondetes) x 100
     */
    async execute(request: Request, response: Response){
        const {survey_id} = request.params;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const surveysUsers = await surveysUsersRepository.find({
            survey_id
        })

        const detractor = surveysUsers.filter( 
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length

        const promoters = surveysUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length

        const passive = surveysUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length

        const totalAnswers = surveysUsers.length

        const calculate = (promoters - detractor) / totalAnswers

        return response.json({
            detractor,
            promoters,
            passive,
            totalAnswers,
            nps: calculate
        })
    }
}

export {NpsController}