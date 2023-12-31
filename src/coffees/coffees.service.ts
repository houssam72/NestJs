import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coffee } from './entities/coffe.entity';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffesConfig from './config/coffes.config';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly cofeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    // private readonly connection: Connection,
    @Inject('COFFEE_BRANDS') coffeBrands: string[],
    private readonly configService: ConfigService,
    @Inject(coffesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffesConfig>,
  ) {
    console.log('Non-class-based Provider Tokens', coffeBrands);
    // Access validated configuration settings using the ConfigService
    const dataBase = this.configService.get<string>(
      'database.host',
      'localhost',
    );
    console.log('ConfigService', dataBase);
    const coffesConfig0 = this.configService.get('coffees');
    console.log('coffesConfig0', coffesConfig0);
    console.log('coffesConfig1', coffeesConfiguration);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.cofeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  findOne(id: string) {
    const coffee = this.cofeeRepository.find({
      where: { id: +id },
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffe #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const coffee = this.cofeeRepository.create({ ...createCoffeeDto, flavors });
    return this.cofeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors = await Promise.all(
      updateCoffeeDto.flavors &&
        (await Promise.all(
          updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
        )),
    );

    const coffee = await this.cofeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.cofeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffe = await this.findOne(id);
    return this.cofeeRepository.remove(coffe);
  }

  // async recommendCoffe(coffe: Coffee) {
  //   const queryRunner = this.connection.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     coffe.recommendations++;

  //     const recommendEvent = new Event();

  //     recommendEvent.name = 'recommend_coffee';
  //     recommendEvent.type = 'coffee';
  //     recommendEvent.payload = { coffeeId: coffe.id };

  //     await queryRunner.manager.save(coffe);
  //     await queryRunner.manager.save(recommendEvent);

  //     await queryRunner.commitTransaction();
  //   } catch (err) {
  //     // since we have errors lets rollback the changes we made
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     // you need to release a queryRunner which was manually instantiated
  //     await queryRunner.release();
  //   }
  // }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.find({
      where: { name: name },
    })[0];
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
