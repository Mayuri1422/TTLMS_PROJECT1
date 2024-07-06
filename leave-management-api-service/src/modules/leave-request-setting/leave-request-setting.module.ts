import { Module } from '@nestjs/common';
import { LeaveRequestSettingService } from './leave-request-setting.service';
import { LeaveRequestSettingController } from './leave-request-setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequestSetting } from './entities/leave-request-setting.entity';

@Module({
  imports:[TypeOrmModule.forFeature([LeaveRequestSetting,])],
  controllers: [LeaveRequestSettingController],
  providers: [LeaveRequestSettingService],
})
export class LeaveRequestSettingModule {}
