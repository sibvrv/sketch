import {Vec2} from '@Framework/math/Vec2';

class TControlParam {
  name = '';
  tags = [];

  value_min = null;
  value_max = null;
  value_offset = 0;
  value = 0;
}

export class TController {
  type: string;
  points: Vec2[] = []; // control points
  lines: Vec2[] = []; // lines for points

  params: any = {}; // per point

  /**
   * TController Constructor
   */
  constructor(options: any) {
    this.type = options.type || 'splitter';
  }
}

export class TControllerList {
  items: TController[] = [];
  selected = [];

  add(ctl: TController) {
    this.items.push(ctl);
  }
}
