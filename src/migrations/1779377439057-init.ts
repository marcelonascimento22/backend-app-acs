import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779377439057 implements MigrationInterface {
    name = 'Init1779377439057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "gestacao" ("id" SERIAL NOT NULL, "data_ultima_menstruacao" date NOT NULL, "data_prevista_parto" date, "alto_risco" boolean NOT NULL DEFAULT false, "observacoes" text, "pessoa_id" integer, CONSTRAINT "PK_0949f0900e0a2c4f7d9e658fadd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prenatal" ("id" SERIAL NOT NULL, "dataConsulta" date NOT NULL, "idadeGestacional" integer, "pesoGestante" numeric(5,2), "pressaoArterial" character varying(7), "alturaUterina" numeric(5,2), "batimentosFetais" integer, "examesSolicitados" text, "observacoes" text, "gestacao_id" integer, "consulta_id" integer, CONSTRAINT "REL_cd422b3e5700d9179da2a4acfe" UNIQUE ("consulta_id"), CONSTRAINT "PK_ac96fcb0bf999592f32f210ee4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "slot" ("id" SERIAL NOT NULL, "horario" TIME NOT NULL, "capacidade" integer NOT NULL, "ocupados" integer NOT NULL DEFAULT '0', "status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL, "agenda_id" integer NOT NULL, CONSTRAINT "UQ_40ead2159377c2168ebde4e9155" UNIQUE ("agenda_id", "horario"), CONSTRAINT "PK_5b1f733c4ba831a51f3c114607b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "agendamento" ("id" SERIAL NOT NULL, "status" character varying NOT NULL DEFAULT 'AGENDADO', "data" date NOT NULL, "observacao" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "pessoa_id" integer NOT NULL, "slot_id" integer NOT NULL, CONSTRAINT "UQ_4156d5c3f192abdea808067dfc0" UNIQUE ("pessoa_id", "slot_id"), CONSTRAINT "PK_a102b15cfec9ce6d8ac6193345f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "consulta" ("id" SERIAL NOT NULL, "profissional_id" integer NOT NULL, "data_consulta" date NOT NULL, "tipo" character varying NOT NULL, "status" character varying NOT NULL, "observacoes" character varying, "descricao" text NOT NULL, "diagnostico" character varying, "prescricao" character varying, "pessoa_id" integer, "agendamento_id" integer, CONSTRAINT "PK_248230d7f1e2536f83b4d07c955" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "agenda" ("id" SERIAL NOT NULL, "data_prevista" date NOT NULL, "tipo" character varying(50) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'ATIVO', "ativo" boolean NOT NULL DEFAULT true, "observacoes" character varying, "prioridade" character varying NOT NULL DEFAULT 'normal', "quatidade_atendimentos" integer, "hora_inicio" character varying, "hora_fim" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "pessoa_id" integer, "consulta_id" integer, "profissional_id" integer NOT NULL, CONSTRAINT "UQ_f44e72b19ad295da0febb3a12b3" UNIQUE ("data_prevista", "profissional_id"), CONSTRAINT "PK_49397cfc20589bebaac8b43251d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profissional" ("id" SERIAL NOT NULL, "usuarios_id" integer NOT NULL, "especialidade" character varying(100), "conselho" character varying(20), "numeroregistro" character varying(50), "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_78e0083bbda72b3f1dab341145" UNIQUE ("usuarios_id"), CONSTRAINT "PK_2e385f6afaa389d36d3d718536f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "zonas" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "descricao" character varying, "geometria" geometry(Polygon,4326) NOT NULL, CONSTRAINT "PK_a2af808b9c6ed91c353fd980ab0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios_zonas" ("id" SERIAL NOT NULL, "usuario_id" integer, "zona_id" integer, CONSTRAINT "PK_e62b502b69edfd40e30a6ad0f93" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "cpf" character varying, "email" character varying NOT NULL, "telefone" character varying NOT NULL, "senha_hash" character varying NOT NULL, "perfil" character varying NOT NULL DEFAULT 'ACS', "ativo" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_ebebcaef8457dcff6e6d69f17b0" UNIQUE ("cpf"), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "visita" ("id" SERIAL NOT NULL, "data_visita" date NOT NULL, "tipo_visita" character varying(100) NOT NULL, "situacao_familia" text, "encaminhamento" boolean NOT NULL DEFAULT false, "observacoes" text, "familia_id" integer, "pessoa_id" integer, "acs_id" integer, CONSTRAINT "PK_8ffe9de9ae8f45fbeaaea4d5552" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "familia" ("id" SERIAL NOT NULL, "endereco" character varying, "descricao" character varying, "numero" character varying, "bairro" character varying, "cep" character varying, "latitude" numeric(10,8), "longitude" numeric(11,8), "acs_id" integer NOT NULL, CONSTRAINT "PK_3d7c978dd5cf101f40ffd8dab25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comorbidade" ("id" SERIAL NOT NULL, "nome" character varying(150) NOT NULL, "descricao" text, "cid" character varying(10), "ativo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a6331378692872dd9095719a394" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pessoa_comorbidade" ("id" SERIAL NOT NULL, "data_diagnostico" date, "observacao" text, "status" character varying NOT NULL DEFAULT 'ativo', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "pessoa_id" integer, "comorbidade_id" integer, CONSTRAINT "UQ_abdd99f495f455347721d921534" UNIQUE ("pessoa_id", "comorbidade_id"), CONSTRAINT "PK_66508cb9a664c5638444279de73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pessoa" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL DEFAULT '', "cpf" character varying, "sus" character varying, "data_nascimento" date, "sexo" character varying, "telefone" character varying, "familia_id" integer, CONSTRAINT "PK_bb879ac36994545a5a917a09ba5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vacinacao" ("id" SERIAL NOT NULL, "data_aplicacao" date NOT NULL, "dose" character varying, "lote" character varying, "pessoa_id" integer NOT NULL, "vacina_id" integer, CONSTRAINT "PK_2747ad035854c7cf8f16bee96c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."vacina_via_administracao_enum" AS ENUM('IM', 'SC', 'VO', 'ID')`);
        await queryRunner.query(`CREATE TABLE "vacina" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "descricao" character varying NOT NULL, "codigo" character varying, "fabricante" character varying, "lote" character varying, "validade" TIMESTAMP, "dose_recomendada" character varying, "via_administracao" "public"."vacina_via_administracao_enum", "grupo_alvo" character varying, "intervalo_doses" integer, "ativa" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_3ce34bd3311a841566ac4be8e03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lote" ("id" SERIAL NOT NULL, "codigo" character varying NOT NULL, "validade" date NOT NULL, "quantidade" integer NOT NULL DEFAULT '0', "vacina_id" integer, CONSTRAINT "PK_db72652dca29e9e818c3c10abed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios_zona" ("usuario_id" integer NOT NULL, "zona_id" integer NOT NULL, CONSTRAINT "PK_dd46a801dfc336bab33d9bb0639" PRIMARY KEY ("usuario_id", "zona_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_48972050905f4a7693d498573d" ON "usuarios_zona" ("usuario_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_571557be40fc9d28584d3a942c" ON "usuarios_zona" ("zona_id") `);
        await queryRunner.query(`ALTER TABLE "gestacao" ADD CONSTRAINT "FK_44ab79e8df5ddf54a18b805f3e9" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prenatal" ADD CONSTRAINT "FK_78f15d106c5574e91bf70def5b5" FOREIGN KEY ("gestacao_id") REFERENCES "gestacao"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prenatal" ADD CONSTRAINT "FK_cd422b3e5700d9179da2a4acfe8" FOREIGN KEY ("consulta_id") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "slot" ADD CONSTRAINT "FK_10bce4568d8c53ee457d34cd441" FOREIGN KEY ("agenda_id") REFERENCES "agenda"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agendamento" ADD CONSTRAINT "FK_e354be9783d81fc9848b549c3d8" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agendamento" ADD CONSTRAINT "FK_617053b3947adfb142f4a5104b4" FOREIGN KEY ("slot_id") REFERENCES "slot"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_8f8db32ec958009c61431420b5d" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consulta" ADD CONSTRAINT "FK_8623a48d33e9179ae7b7155ad64" FOREIGN KEY ("agendamento_id") REFERENCES "agendamento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agenda" ADD CONSTRAINT "FK_9f07620e5e10bf5ac4233aebddf" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agenda" ADD CONSTRAINT "FK_1b05290f0c49d0dc294081fa192" FOREIGN KEY ("consulta_id") REFERENCES "consulta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agenda" ADD CONSTRAINT "FK_4e2394bae34d8d9befb3ae4a877" FOREIGN KEY ("profissional_id") REFERENCES "profissional"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profissional" ADD CONSTRAINT "FK_78e0083bbda72b3f1dab3411456" FOREIGN KEY ("usuarios_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios_zonas" ADD CONSTRAINT "FK_c124d6bdbf01cd3412052b0e2c1" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios_zonas" ADD CONSTRAINT "FK_74fa64029a561af3137aae35c08" FOREIGN KEY ("zona_id") REFERENCES "zonas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "visita" ADD CONSTRAINT "FK_76878001047059bcc00fad3509f" FOREIGN KEY ("familia_id") REFERENCES "familia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "visita" ADD CONSTRAINT "FK_242741bdddfe4744ebc1e853ff4" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "visita" ADD CONSTRAINT "FK_15a579ae6fd952b4532472ee8ab" FOREIGN KEY ("acs_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "familia" ADD CONSTRAINT "FK_f0173cf2dd0ef938276581e8751" FOREIGN KEY ("acs_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pessoa_comorbidade" ADD CONSTRAINT "FK_5746f891f4259bc5f12bb67da0c" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pessoa_comorbidade" ADD CONSTRAINT "FK_768591b60e839b6f558677e61d3" FOREIGN KEY ("comorbidade_id") REFERENCES "comorbidade"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pessoa" ADD CONSTRAINT "FK_9ccab04df9801527f8000129a1f" FOREIGN KEY ("familia_id") REFERENCES "familia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vacinacao" ADD CONSTRAINT "FK_a272d1d60220e6c476a15634eff" FOREIGN KEY ("vacina_id") REFERENCES "vacina"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vacinacao" ADD CONSTRAINT "FK_f0a486eacf50a5a261aac4fbed7" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lote" ADD CONSTRAINT "FK_e39c2b90c0935a7fa4ece72cc78" FOREIGN KEY ("vacina_id") REFERENCES "vacina"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios_zona" ADD CONSTRAINT "FK_48972050905f4a7693d498573dc" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "usuarios_zona" ADD CONSTRAINT "FK_571557be40fc9d28584d3a942cc" FOREIGN KEY ("zona_id") REFERENCES "zonas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios_zona" DROP CONSTRAINT "FK_571557be40fc9d28584d3a942cc"`);
        await queryRunner.query(`ALTER TABLE "usuarios_zona" DROP CONSTRAINT "FK_48972050905f4a7693d498573dc"`);
        await queryRunner.query(`ALTER TABLE "lote" DROP CONSTRAINT "FK_e39c2b90c0935a7fa4ece72cc78"`);
        await queryRunner.query(`ALTER TABLE "vacinacao" DROP CONSTRAINT "FK_f0a486eacf50a5a261aac4fbed7"`);
        await queryRunner.query(`ALTER TABLE "vacinacao" DROP CONSTRAINT "FK_a272d1d60220e6c476a15634eff"`);
        await queryRunner.query(`ALTER TABLE "pessoa" DROP CONSTRAINT "FK_9ccab04df9801527f8000129a1f"`);
        await queryRunner.query(`ALTER TABLE "pessoa_comorbidade" DROP CONSTRAINT "FK_768591b60e839b6f558677e61d3"`);
        await queryRunner.query(`ALTER TABLE "pessoa_comorbidade" DROP CONSTRAINT "FK_5746f891f4259bc5f12bb67da0c"`);
        await queryRunner.query(`ALTER TABLE "familia" DROP CONSTRAINT "FK_f0173cf2dd0ef938276581e8751"`);
        await queryRunner.query(`ALTER TABLE "visita" DROP CONSTRAINT "FK_15a579ae6fd952b4532472ee8ab"`);
        await queryRunner.query(`ALTER TABLE "visita" DROP CONSTRAINT "FK_242741bdddfe4744ebc1e853ff4"`);
        await queryRunner.query(`ALTER TABLE "visita" DROP CONSTRAINT "FK_76878001047059bcc00fad3509f"`);
        await queryRunner.query(`ALTER TABLE "usuarios_zonas" DROP CONSTRAINT "FK_74fa64029a561af3137aae35c08"`);
        await queryRunner.query(`ALTER TABLE "usuarios_zonas" DROP CONSTRAINT "FK_c124d6bdbf01cd3412052b0e2c1"`);
        await queryRunner.query(`ALTER TABLE "profissional" DROP CONSTRAINT "FK_78e0083bbda72b3f1dab3411456"`);
        await queryRunner.query(`ALTER TABLE "agenda" DROP CONSTRAINT "FK_4e2394bae34d8d9befb3ae4a877"`);
        await queryRunner.query(`ALTER TABLE "agenda" DROP CONSTRAINT "FK_1b05290f0c49d0dc294081fa192"`);
        await queryRunner.query(`ALTER TABLE "agenda" DROP CONSTRAINT "FK_9f07620e5e10bf5ac4233aebddf"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_8623a48d33e9179ae7b7155ad64"`);
        await queryRunner.query(`ALTER TABLE "consulta" DROP CONSTRAINT "FK_8f8db32ec958009c61431420b5d"`);
        await queryRunner.query(`ALTER TABLE "agendamento" DROP CONSTRAINT "FK_617053b3947adfb142f4a5104b4"`);
        await queryRunner.query(`ALTER TABLE "agendamento" DROP CONSTRAINT "FK_e354be9783d81fc9848b549c3d8"`);
        await queryRunner.query(`ALTER TABLE "slot" DROP CONSTRAINT "FK_10bce4568d8c53ee457d34cd441"`);
        await queryRunner.query(`ALTER TABLE "prenatal" DROP CONSTRAINT "FK_cd422b3e5700d9179da2a4acfe8"`);
        await queryRunner.query(`ALTER TABLE "prenatal" DROP CONSTRAINT "FK_78f15d106c5574e91bf70def5b5"`);
        await queryRunner.query(`ALTER TABLE "gestacao" DROP CONSTRAINT "FK_44ab79e8df5ddf54a18b805f3e9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_571557be40fc9d28584d3a942c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48972050905f4a7693d498573d"`);
        await queryRunner.query(`DROP TABLE "usuarios_zona"`);
        await queryRunner.query(`DROP TABLE "lote"`);
        await queryRunner.query(`DROP TABLE "vacina"`);
        await queryRunner.query(`DROP TYPE "public"."vacina_via_administracao_enum"`);
        await queryRunner.query(`DROP TABLE "vacinacao"`);
        await queryRunner.query(`DROP TABLE "pessoa"`);
        await queryRunner.query(`DROP TABLE "pessoa_comorbidade"`);
        await queryRunner.query(`DROP TABLE "comorbidade"`);
        await queryRunner.query(`DROP TABLE "familia"`);
        await queryRunner.query(`DROP TABLE "visita"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TABLE "usuarios_zonas"`);
        await queryRunner.query(`DROP TABLE "zonas"`);
        await queryRunner.query(`DROP TABLE "profissional"`);
        await queryRunner.query(`DROP TABLE "agenda"`);
        await queryRunner.query(`DROP TABLE "consulta"`);
        await queryRunner.query(`DROP TABLE "agendamento"`);
        await queryRunner.query(`DROP TABLE "slot"`);
        await queryRunner.query(`DROP TABLE "prenatal"`);
        await queryRunner.query(`DROP TABLE "gestacao"`);
    }

}
