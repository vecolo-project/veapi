import { Repository } from 'typeorm';
import { Factory } from '../../types';

export default class EntitySeed<Entity> {
  private repo: Repository<Entity>;
  private factory: Factory<Entity>;

  constructor(repo: Repository<Entity>, factory: Factory<Entity>) {
    this.repo = repo;
    this.factory = factory;
  }

  public async seedOne(data?: Partial<Entity>): Promise<Entity> {
    const ent = await this.factory(data);
    await this.repo.save(ent);
    return ent;
  }

  public async seedMany(
    amount: number,
    data?: Partial<Entity>
  ): Promise<Entity[]> {
    const res: Entity[] = [];
    for (let i = 0; i < amount; i++) {
      res[i] = await this.factory(data);
      await this.repo.save(res[i]);
    }
    return res;
  }
}
