import {TPoint} from '@editor/TPoint';
import {TPath} from '@editor/TPath';
import {compact} from '@core/common/compact';

function pointToText(point: TPoint) {
  const ret: any = {
    x: point.x,
    y: point.y
  };

  if (point.r) {
    ret['r'] = point.r;
    ret['s'] = point.steps;
  }
  return ret;
}

export function pathToText(path: TPath) {
  let ret = [] as any;
  let prev = new TPoint();

  for (let i = 0; i < path.path.length; i++) {
    ret = ret.concat(pointToText(path.path[i]));
    prev = path.path[i];
  }

  return compact({
    ...path.rawProps,
    path: ret
  });
}
