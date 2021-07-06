import { Inject, Service } from 'typedi';
import { BikeModel, BikeModelRepository } from '../entities/BikeModel';
import CRUD from './CRUD';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import { UploadedFile } from 'express-fileupload';
import { generatePrefix } from '../../helpers/FileHelper';
import UPLOAD_PATH from '../../config/uploadPath';
import { ErrorHandler } from 'src/helpers/ErrorHandler';

@Service()
export default class BikeModelService extends CRUD<BikeModel> {
  constructor(
    @InjectRepository(BikeModel)
    protected bikeModelRepo: BikeModelRepository,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(bikeModelRepo, logger);
  }

  async getAllFromManufacturer(id: number): Promise<BikeModel[]> {
    return this.bikeModelRepo.find({ where: { bikeManufacturer: id } });
  }

  async findOneWithManufacturer(id: number): Promise<BikeModel | undefined> {
    const entity = await this.repo.findOne(id, {
      relations: ['bikeManufacturer'],
    });
    if (entity) {
      return entity;
    }
    throw new ErrorHandler(404, 'Not found');
  }

  handleImageUpload(file: UploadedFile, id: number): string {
    const prefix = generatePrefix();
    const filename = prefix + file.name;
    file.mv(UPLOAD_PATH.bikeModelImage + filename);
    this.bikeModelRepo.update(id, { image: filename });
    return filename;
  }
}
