import { Controller, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/constants';
import { DevService } from './dev.service';

@ApiTags('Dev')
@Controller({ path: 'dev', version: '1' })
export class DevController {
  constructor(private readonly devService: DevService) {}

  @Public()
  @Delete('reset-db')
  @ApiOperation({
    summary: '⚠️ Wipe entire database',
    description:
      'Truncates ALL tables in the public schema. ' +
      'For development and teaching purposes only. ' +
      'No auth required — handle with care.',
  })
  @ApiResponse({ status: 200, description: 'Database successfully wiped.' })
  resetDatabase() {
    return this.devService.resetDatabase();
  }
}
