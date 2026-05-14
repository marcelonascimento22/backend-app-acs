import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
  Req,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PerfilUsuario } from './entities/perfil-usuario.enum';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Post()
  create(@Body() data: CreateUsuarioDto) {
    return this.service.create(data);
  }

  @Get()
  findAll(@Query('perfil') perfil?: PerfilUsuario) {
    return this.service.findAll(perfil);
  }

  @Get('me/:id')
  getMe(@Param('id', ParseIntPipe) id: number) {
    return this.service.findMe(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch('me')
  updateMe(@Req() req, @Body() data: any) {
    return this.service.UpdateMe(req.user.id, data);
  }

  @Patch('me/senha')
  alterarSenha(@Req() req, @Body() body: any) {
    if (!body.atual || !body.nova) {
      throw new BadRequestException('Senha atual e nova são obrigatórias');
    }

    return this.service.alterarSenha(
      req.user.id,
      body.atual,
      body.nova
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUsuarioDto,
  ) {
    console.log("ID: ", id)
    console.log("Data: ", data)
    //if (data.id) delete data.id;
    return this.service.update(id, data);

  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}