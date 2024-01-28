import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffesController } from 'src/coffees/coffes.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffe.entity';
import { Flavor } from './entities/flavor.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import coffesConfig from './config/coffes.config';

class DevelopmentConfigService {}
class ProductionConfigService {}

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor]),
    ConfigModule.forFeature(coffesConfig),
  ],
  controllers: [CoffesController],
  providers: [
    CoffeesService,
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'developement'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
    { provide: 'COFFEE_BRANDS', useFactory: () => ['buddy brew', 'nescafe'] },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
