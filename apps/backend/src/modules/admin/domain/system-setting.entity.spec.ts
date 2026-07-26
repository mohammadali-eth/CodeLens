import { SystemSettingEntity } from './system-setting.entity';

describe('SystemSettingEntity', () => {
  it('should initialize correctly with constructor values', () => {
    const setting = new SystemSettingEntity(
      'setting-1',
      'MAX_REVIEW_FILES',
      '50',
      'Maximum files allowed per review',
      true,
      'user-1',
    );

    expect(setting.id).toBe('setting-1');
    expect(setting.key).toBe('MAX_REVIEW_FILES');
    expect(setting.value).toBe('50');
    expect(setting.description).toBe('Maximum files allowed per review');
    expect(setting.isPublic).toBe(true);
    expect(setting.updatedById).toBe('user-1');
  });

  it('should parse number values correctly', () => {
    const setting = new SystemSettingEntity('setting-1', 'PORT', '4000');
    expect(setting.getValueAsNumber()).toBe(4000);
  });

  it('should parse boolean values correctly', () => {
    const settingTrue = new SystemSettingEntity('1', 'ENABLE_AI', 'true');
    const settingFalse = new SystemSettingEntity('2', 'ENABLE_AI', 'false');

    expect(settingTrue.getValueAsBoolean()).toBe(true);
    expect(settingFalse.getValueAsBoolean()).toBe(false);
  });

  it('should parse JSON values correctly', () => {
    const jsonStr = JSON.stringify({ theme: 'dark', itemsPerPage: 20 });
    const setting = new SystemSettingEntity('1', 'UI_CONFIG', jsonStr);

    expect(
      setting.getValueAsJson<{ theme: string; itemsPerPage: number }>(),
    ).toEqual({
      theme: 'dark',
      itemsPerPage: 20,
    });
  });

  it('should return raw string when JSON parsing fails', () => {
    const setting = new SystemSettingEntity('1', 'RAW_TEXT', 'invalid-json');
    expect(setting.getValueAsJson()).toBe('invalid-json');
  });
});
