import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, ParseIntPipe, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { BatchUpdateDto } from './dto/batch-update.dto';
import { ElementNotFoundError } from '../common/exceptions/element-not-found.error';

/* 
  Traer items asociados a lista
  leer item especifico de lista
  Agregar item a lista
  Borrar item de lista
  Completar item


  Agregar error handling con diferentes error responses,
  Agregar background job para maracar complete un batch de items gigante
  Agregar test unitaros a el controller

*/

@Controller('api/todolists/:todoListId/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto, @Param('todoListId', ParseIntPipe) todoListId: number) {
    try {
      return this.itemsService.create(createItemDto, todoListId);
    }
    catch(error) {
      if(error instanceof ElementNotFoundError) {
        throw new NotFoundException(error.message);
      }
      else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  @Get()
  index(@Param('todoListId', ParseIntPipe) todoListId: number) {
    try {
      return this.itemsService.all(todoListId);
    } catch (error) {
      if(error instanceof ElementNotFoundError) {
        throw new NotFoundException(error.message);
      }
      else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  @Get(':id')
  show(@Param('todoListId', ParseIntPipe) todoListId: number, @Param('id', ParseIntPipe) id: number) {
    try {
      return this.itemsService.get(todoListId, id);    
    } catch (error) {
      if(error instanceof ElementNotFoundError) {
        throw new NotFoundException(error.message);
      }
      else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  @Patch(':id/complete')
  complete(@Param('todoListId', ParseIntPipe) todoListId: number, @Param('id', ParseIntPipe) id: number) {
    try {
      return this.itemsService.complete(todoListId, id);
    } catch (error) {
      if(error instanceof ElementNotFoundError) {
        throw new NotFoundException(error.message);
      }
      else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  @Patch('batchComplete')
  batchUComplete(@Body() batchUpdateDto: BatchUpdateDto, @Param('todoListId', ParseIntPipe) todoListId: number) {
    const {ids} = batchUpdateDto;
    return this.itemsService.batchComplete(todoListId, ids);
  }

  @Delete(':id')
  delete(@Param('todoListId', ParseIntPipe) todoListId: number, @Param('id', ParseIntPipe) id: number) {
    try {
      return this.itemsService.delete(todoListId, id);
    }
    catch (error) {
      if(error instanceof ElementNotFoundError) {
        throw new NotFoundException(error.message);
      }
      else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
