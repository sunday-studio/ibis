import { action } from 'mobx';

export const mobxDebounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return action(function (this: any, ...args: Parameters<T>) {
    const context = this;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  }) as T;
};
