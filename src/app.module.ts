import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaModule } from './pessoa/pessoa.module';
import { FamiliaModule } from './familia/familia.module';
import { VisitaModule } from './visita/visita.module';
import { VacinacaoModule } from './vacinacao/vacinacao.module';
import { GestacaoModule } from './gestacao/gestacao.module';
import { ZonasModule } from './zonas/zonas.module';
import { GeocodeModule } from './geocode/geocode.module';
import { ComorbidadeModule } from './comorbidade/comorbidade.module';
import { PessoaComorbidadeModule } from './pessoa-comorbidade/pessoa-comorbidade.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { UsuariosZonasModule } from './usuarios_zonas/usuarios_zonas.module';
import { UsuariosZona } from './usuarios_zonas/entities/usuarios_zona.entity';
import { Zona } from './zonas/entities/zona.entity';
import { Usuario } from './usuarios/entities/usuario.entity';
import { AuthModule } from './auth/auth.module';
import { PrenatalModule } from './prenatal/prenatal.module';
import { ConsultaModule } from './consulta/consulta.module';
import { AgendaModule } from './agenda/agenda.module';
import { VacinaModule } from './vacina/vacina.module';
import { Pessoa } from './pessoa/entities/pessoa.entity';
import { Vacina } from './vacina/entities/vacina.entity';
import { Vacinacao } from './vacinacao/entities/vacinacao.entity';
import { Gestacao } from './gestacao/entities/gestacao.entity';
import { ProfissionalModule } from './profissional/profissional.module';
import { SlotModule } from './slot/slot.module';
import { AgendamentoModule } from './agendamento/agendamento.module';
import { DisponibilidadeModule } from './disponibilidade/disponibilidade.module';
import { LoteModule } from './lote/lote.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './common/custom-throttler.guard';
import { InternalController } from './internal/internal.controller';
import { InternalModule } from './internal/internal.module';
import { TestController } from '../test/test.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      entities: [
        Usuario, 
        Zona, 
        UsuariosZona, 
        Pessoa, 
        Vacina, 
        Vacinacao, 
        Gestacao
      ],
      synchronize: false,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10,
          limit: 3,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PessoaModule,
    FamiliaModule,
    VisitaModule,
    VacinacaoModule,
    GestacaoModule,
    ZonasModule,
    GeocodeModule,
    ComorbidadeModule,
    PessoaComorbidadeModule,
    UsuariosModule,
    UsuariosZonasModule,
    AuthModule,
    PrenatalModule,
    ConsultaModule,
    AgendaModule,
    VacinaModule,
    ProfissionalModule,
    SlotModule,
    AgendamentoModule,
    DisponibilidadeModule,
    LoteModule,
    InternalModule,
  ],
  controllers: [
    InternalController, 
    TestController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],

})
export class AppModule {}