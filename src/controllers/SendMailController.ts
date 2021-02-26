import { getCustomRepository, RepositoryNotTreeError } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepositoy";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailServices";

class SendMailController {
    async execute(request: Request, response: Response){
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository)
        const surveysRepository = getCustomRepository(SurveysRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const userAlreadyExists = await usersRepository.findOne({email})

        if(!userAlreadyExists){            
            return response.status(400).json({
                error: "User does not exists"
            })
        }

        const survey = await surveysRepository.findOne({id: survey_id})

        if(!survey){
            return response.status(400).json({
                error: "Survey does not exists!"
            })
        }

        //Salvar as informações na tabela SurveysUser
        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id,
        });

        await surveysUsersRepository.save(surveyUser)
        //Enviar e-mail para usuário

        await SendMailService.execute(email, survey.title, survey.description);
        
        return response.json(surveyUser)

        
    }
}

export {SendMailController}