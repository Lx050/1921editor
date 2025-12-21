import { Controller, Post } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('users')
  async syncUsers() {
    await this.syncService.syncUsersFromBase();
    return { success: true, message: 'Sync started' };
  }
}
