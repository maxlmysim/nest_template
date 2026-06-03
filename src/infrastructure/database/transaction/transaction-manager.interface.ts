export interface TransactionManager {
  run<T>(callback: () => Promise<T>): Promise<T>;
}
