/**
 * Class Mix Object Data
 */
declare global {
  interface IClassMixObject {
    [paramName: string]: string | boolean | number;
  }
}

/**
 * Class combiner
 * Usage:
 * {
 *   'big-boss': true,
 *   'lost-in-space': true,
 *   'world-war-nine': false
 * }
 */
export function classMix(data: IClassMixObject) {
  const classList = [];
  for (const className in data) {
    if (data[className]) {
      classList.push(className);
    }
  }
  return classList.join(' ');
}
