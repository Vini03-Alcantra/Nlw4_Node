import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/SurveyUser";

@EntityRepository(SurveyUser)
class SurveysusersRepository extends Repository<SurveyUser>{}

export {SurveysusersRepository}