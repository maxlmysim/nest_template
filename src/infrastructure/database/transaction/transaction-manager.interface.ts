export interface ITransactionManager {
  run<T>(callback: () => Promise<T>): Promise<T>;
}

export const InjectTransactionManager = Symbol('InjectTransactionManager');
