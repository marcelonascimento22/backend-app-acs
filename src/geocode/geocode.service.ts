import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocodeService {
  private readonly logger = new Logger(GeocodeService.name);

  async buscarCoordenadas(endereco: string) {
    const tentar = async (query: string) => {
      try {
        const response = await axios.get<any[]>(
          'https://nominatim.openstreetmap.org/search',
          {
            params: {
              q: query,
              format: 'json',
              limit: 1,
              addressdetails: 1, // Útil para validar se encontrou a cidade certa
            },
            headers: {
              'User-Agent': 'acs-app-map/1.0 (seu-email@dominio.com)', // Nominatim pede um email ou nome de app claro
            },
            timeout: 5000, // 5 segundos de limite
          },
        );

        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          return {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          };
        }
      } catch (error) {
        this.logger.error(`Erro na geocodificação para: ${query}`, error.stack);
      }
      return null;
    };

    // 1. Tentativa: Endereço completo
    let result = await tentar(endereco);
    if (result) return result;

    // Pequeno delay para respeitar o Nominatim se a primeira falhar
    await new Promise(resolve => setTimeout(resolve, 500));

    // 2. Tentativa: Remove apenas números isolados (prováveis números de casa) 
    // mas tenta manter o CEP se houver hífen (ex: 00000-000)
    this.logger.log("Tentando simplificar endereço...");
    const semNumero = endereco.replace(/(?<!\d)\d+(?!\d-)/g, '').trim();
    result = await tentar(semNumero);
    if (result) return result;

    // 3. Tentativa: Só Cidade e Estado (assumindo que o endereço termina com "Cidade, Estado")
    this.logger.log("Tentando apenas localidade...");
    const partes = endereco.split(',');
    if (partes.length >= 2) {
      const cidadeEstado = partes.slice(-2).join(',');
      result = await tentar(cidadeEstado);
    }

    return result;
  }
}