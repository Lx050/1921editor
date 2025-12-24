import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { FeishuService } from '../feishu/feishu.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private feishuService: FeishuService,
    private configService: ConfigService,
  ) {}

  async syncUsersFromBase() {
    this.logger.log('Starting User Sync from Feishu Base...');
    const client = this.feishuService.getClient();

    // 使用人员管理表配置
    const appToken = this.configService.get<string>(
      'FEISHU_USER_BASE_APP_TOKEN',
    );
    const tableId = this.configService.get<string>('FEISHU_USER_BASE_TABLE_ID');

    if (!appToken || !tableId) {
      this.logger.error(
        'Missing FEISHU_USER_BASE_APP_TOKEN or FEISHU_USER_BASE_TABLE_ID',
      );
      this.logger.warn(
        'Please configure the user management table in .env file',
      );
      return;
    }

    try {
      // 1. List records from Base
      // Note: Using bitable.app.table.record.list (v1)
      const res = await client.bitable.appTableRecord.list({
        path: {
          app_token: appToken,
          table_id: tableId,
        },
        params: {
          page_size: 100,
        },
      });

      if (res.code !== 0 || !res.data) {
        this.logger.error(`Failed to fetch records: ${res.msg}`);
        return;
      }

      const records = res.data.items || [];
      this.logger.log(`Found ${records.length} records in Base.`);

      if (records.length > 0) {
        this.logger.log(
          `First record fields: ${JSON.stringify(records[0].fields)}`,
        );
      }

      for (const record of records) {
        const fields = record.fields;
        // Assume mapping based on user's potential Base structure
        const name = String(
          fields['姓名'] || fields['Name'] || fields['name'] || 'Unknown',
        );
        const roleStr = String(
          fields['岗位'] || fields['Role'] || fields['role'] || '',
        );
        const feishuIdValue =
          fields['FeishuID'] || fields['OpenID'] || fields['ID'];
        const feishuId = feishuIdValue ? String(feishuIdValue) : '';

        this.logger.debug(
          `Processing: name=${name}, role=${roleStr}, id=${feishuId}`,
        );

        if (!feishuId) {
          this.logger.warn(
            `Record missing FeishuID: ${JSON.stringify(fields)}`,
          );
          continue;
        }

        let role = UserRole.EDITOR;
        if (roleStr === '文案') role = UserRole.COPYWRITER;
        if (roleStr === '策划') role = UserRole.PLANNER;

        let user = await this.userRepository.findOne({
          where: { feishuId: feishuId as any },
        });
        if (!user) {
          user = this.userRepository.create({
            feishuId,
            name: name,
            role,
          });
        } else {
          user.name = name;
          user.role = role;
        }
        await this.userRepository.save(user);
      }
      this.logger.log('User Sync Completed.');
    } catch (e) {
      this.logger.error('Sync Failed', e);
    }
  }
}
