import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Res,
  Patch,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CoffeesService } from 'src/coffees/coffees.service';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from 'src/coffees/dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { ParseIntPipe } from '../common/pipes/parse-int/parse-int.pipe';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

@UsePipes(ValidationPipe)
@Controller('coffes')
@ApiTags('coffes')
export class CoffesController {
  constructor(private readonly coffesService: CoffeesService) {}
  @ApiForbiddenResponse({ description: 'Forbiden' })
  @Get('')
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.coffesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.coffesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  create(@Body() CreateCoffeeDto: CreateCoffeeDto) {
    return this.coffesService.create(CreateCoffeeDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) UpdateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffesService.update(id, UpdateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffesService.remove(id);
  }
}
