import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TenantService } from './tenant.service';

@ApiTags('Tenants')
@Controller('api/tenants')
export class TenantController {
    constructor(private readonly tenantService: TenantService) { }

    @Get()
    @ApiOperation({ summary: '获取所有租户' })
    async findAll() {
        const tenants = await this.tenantService.findAll();
        return tenants.map(t => ({
            id: t.id,
            name: t.name,
            slug: t.slug
        }));
    }
}
