import { Injectable } from '@nestjs/common';

@Injectable()
export class SyncService {

  async download(ultimaSync?: string) {

    const dataReferencia = ultimaSync
      ? new Date(ultimaSync)
      : new Date('2000-01-01');

    return {
      success: true,
      servidorData: new Date(),
      ultimaSync: dataReferencia,
      pessoas: [],
      familias: [],
      domicilios: [],
      visitas: [],
    };
  }

  async upload(payload: any) {

    const {
      pessoas = [],
      familias = [],
      domicilios = [],
      visitas = [],
    } = payload;

    return {
      success: true,
      sincronizados: {
        pessoas: pessoas.length,
        familias: familias.length,
        domicilios: domicilios.length,
        visitas: visitas.length,
      },
    };
  }

  async status() {

    return {
      success: true,
      servidorOnline: true,
      dataServidor: new Date(),
    };
  }
}