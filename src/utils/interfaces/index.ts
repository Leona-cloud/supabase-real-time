export type Optional<T, Key extends keyof T> = Omit<T, Key> & Partial<T>;

export interface GenerateIdOption {
  type: 'identifier' | 'otp';
  length?: number;
  prefix?: number;
}
