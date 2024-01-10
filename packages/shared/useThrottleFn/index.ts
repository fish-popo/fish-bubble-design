/*
 * @Date: 2023-12-02 11:52:03
 * @Description: 节流
 */
import { toValue } from "../toValue";
import { tryOnScopeDispose } from "../tryOnScopeDispose";
import { AnyFn } from "../utils";

/**
 *
 * @param fn 节流的函数
 * @param options { wait 等待时间,  leading 是否在延迟开始前调用函数 }
 * @returns throttleFn
 */
export function useThrottleFn<T extends AnyFn>(fn: T, options?: { wait?: number; leading?: boolean }) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastExecTime = 0;

  const { wait, leading } = { wait: 300, leading: false, ...options };
  // 时间
  const duration = toValue(wait);

  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  const throttledFn = (...args) => {
    const invoke = () => {
      lastExecTime = Date.now();
      fn(...args);
    };

    clear();

    const elapsed = Date.now() - lastExecTime;

    if (elapsed > duration && leading) {
      invoke();
    } else {
      timer = setTimeout(invoke, leading ? duration : Math.max(0, duration - elapsed));
    }
  };

  tryOnScopeDispose(clear);

  return throttledFn;
}
