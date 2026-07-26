import { SystemSettingEntity } from '../../domain/system-setting.entity';

export const SYSTEM_SETTING_REPOSITORY = Symbol('SYSTEM_SETTING_REPOSITORY');

export interface ISystemSettingRepository {
  getAll(): Promise<SystemSettingEntity[]>;
  getByKey(key: string): Promise<SystemSettingEntity | null>;
  upsert(key: string, value: string, description?: string, isPublic?: boolean, updatedById?: string): Promise<SystemSettingEntity>;
  bulkUpdate(settings: Array<{ key: string; value: string }>, updatedById?: string): Promise<SystemSettingEntity[]>;
}
