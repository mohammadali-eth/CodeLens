/**
 * SystemSettingEntity Domain Entity
 * Purpose: Encapsulates platform configuration settings.
 * Responsibilities: Holds key-value configuration values with metadata and audit context.
 * Dependencies: None.
 */
export class SystemSettingEntity {
  constructor(
    public readonly id: string,
    public readonly key: string,
    public readonly value: string,
    public readonly description?: string | null,
    public readonly isPublic: boolean = false,
    public readonly updatedById?: string | null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  public getValueAsJson<T = any>(): T {
    try {
      return JSON.parse(this.value);
    } catch {
      return this.value as unknown as T;
    }
  }

  public getValueAsNumber(): number {
    return Number(this.value);
  }

  public getValueAsBoolean(): boolean {
    return this.value === 'true' || this.value === '1';
  }
}
