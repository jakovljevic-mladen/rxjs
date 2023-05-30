import { MonoTypeOperatorFunction } from '../types';
import { EMPTY } from '../observable/empty';
import { Observable } from '../Observable';
import { createOperatorSubscriber } from './OperatorSubscriber';

/**
 * Emits only the first `count` values emitted by the source Observable.
 *
 * <span class="informal">Takes the first `count` values from the source, then
 * completes.</span>
 *
 * ![](take.png)
 *
 * `take` returns an Observable that emits only the first `count` values emitted
 * by the source Observable. If the source emits fewer than `count` values then
 * all of its values are emitted. After that, it completes, regardless if the
 * source completes.
 *
 * ## Example
 *
 * Take the first 5 seconds of an infinite 1-second interval Observable
 *
 * ```ts
 * import { interval, take } from 'rxjs';
 *
 * const intervalCount = interval(1000);
 * const takeFive = intervalCount.pipe(take(5));
 * takeFive.subscribe(x => console.log(x));
 *
 * // Logs:
 * // 0
 * // 1
 * // 2
 * // 3
 * // 4
 * ```
 *
 * @see {@link takeLast}
 * @see {@link takeUntil}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @param count The maximum number of `next` values to emit.
 * @return A function that returns an Observable that emits only the first
 * `count` values emitted by the source Observable, or all of the values from
 * the source if the source emits fewer than `count` values.
 * @operator
 */
export function take<T>(count: number): MonoTypeOperatorFunction<T> {
  return count <= 0
    ? // If we are taking no values, that's empty.
      () => EMPTY
    : (source) =>
        new Observable((subscriber) => {
          let seen = 0;
          const operatorSubscriber = createOperatorSubscriber<T>(subscriber, (value) => {
            if (++seen < count) {
              subscriber.next(value);
            } else {
              operatorSubscriber.unsubscribe();
              subscriber.next(value);
              subscriber.complete();
            }
          });
          source.subscribe(operatorSubscriber);
        });
}
