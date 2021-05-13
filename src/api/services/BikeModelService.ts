import { Service } from "typedi";
import { BikeModel } from "../entities/BikeModel";
import CRUD from "./CRUD";


@Service()
export default class BikeModelService extends CRUD<BikeModel> {}
