import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';

import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {

  constructor(
    private readonly syncService: SyncService,
  ) {}

  @Get('download')
  download(
    @Query('ultimaSync') ultimaSync?: string,
  ) {
    return this.syncService.download(
      ultimaSync,
    );
  }

  @Post('upload')
  upload(
    @Body() body: any,
  ) {
    return this.syncService.upload(
      body,
    );
  }

  @Get('status')
  status() {
    return this.syncService.status();
  }
}