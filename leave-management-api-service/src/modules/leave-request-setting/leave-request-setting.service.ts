// leave-request-setting.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequestSetting } from './entities/leave-request-setting.entity';
import { CreateLeaveRequestSettingDto } from './dto/create-leave-request-setting.dto';

@Injectable()
export class LeaveRequestSettingService {
  constructor(
    @InjectRepository(LeaveRequestSetting)
    private readonly leaveRequestSettingRepository: Repository<LeaveRequestSetting>,
  ) {}

  async createLeaveRequestSetting(createLeaveRequestSettingDto: CreateLeaveRequestSettingDto): Promise<LeaveRequestSetting> {
    const leaveRequestSetting = this.leaveRequestSettingRepository.create(createLeaveRequestSettingDto);
    return await this.leaveRequestSettingRepository.save(leaveRequestSetting);
  }

  async getLeaveRequestSetting(): Promise<LeaveRequestSetting[]> {
    return await this.leaveRequestSettingRepository.find();
  }
}
