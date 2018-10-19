type PropertyValue = string | number | boolean;

/**
 * Collection Properties Interface
 */
interface CollectionProperties {
  [key: string]: PropertyValue;
}

/**
 * Collection
 */
export class Collection {
  private parent: Collection = null!;
  private _items: Collection[] = [];
  private _childrenCount = 0;
  private properties: CollectionProperties = {};

  /**
   * Collection Constructor
   */
  constructor(public type: string, parent?: Collection) {
    this.parent = parent || null!;
  }

  /**
   * Tiny Proxy
   * @param name
   */
  define<T>(name: string) {
    Object.defineProperty(this, name, {
      set: (value: T) => (this.props(name, value as any) as any) as T,
      get: (): T => (this.props(name) as any) as T
    });
  }

  /**
   * Set prop
   * @param state
   */
  props(state: object): void;
  /**
   * Set or Get prop
   * @param name
   * @param value
   */
  props(name: string, value?: PropertyValue): PropertyValue;
  /**
   * Set or Get props
   * @param stateOrName
   * @param value
   */
  props(stateOrName: object | string, value?: PropertyValue): void | PropertyValue {
    if (typeof stateOrName === 'object') {
      this.properties = {...this.properties, ...stateOrName};
      return;
    }
    if (typeof value !== 'undefined') {
      return this.properties[stateOrName] = value;
    }
    return stateOrName in this.properties ? this.properties[stateOrName] : null!;
  }

  get rawProps() {
    return this.properties;
  }

  /**
   * Attach to other parent
   * @param parent
   */
  attach(parent: Collection) {
    if (this.parent) {
      this.parent.childrenCount -= this.childrenCount;
    }
    this.parent = parent;
    if (this.parent) {
      this.parent.childrenCount += this.childrenCount;
    }
  }

  /**
   * Set Children Count
   * @param count
   */
  set childrenCount(count: number) {
    if (this.parent) {
      this.parent.childrenCount += -this._childrenCount + count;
    }
    this._childrenCount = count;
  }

  /**
   * Get Children Count
   */
  get childrenCount() {
    return this._childrenCount;
  }

  /**
   * Items
   */
  get rawItems(): Collection[] {
    return this._items;
  }

  get(index: number): Collection {
    return this._items[index];
  }

  set(index: number, data: Collection) {
    return this._items[index] = data;
  }

  /**
   * Push Items
   * @param items
   */
  push(...items: Collection[]) {
    Array.prototype.push.apply(this._items, items);
    this.childrenCount += items.length;
    return this._items.length;
  }

  /**
   * Pop item
   */
  pop() {
    this.childrenCount -= 1;
    return this._items.pop();
  }

  remove(index: number) {
    this._items.splice(index, 1);
    this.childrenCount -= 1;
  }

  clean() {
    this.childrenCount -= this._items.length;
    this._items.length = 0;
  }

  indexOf(value: any) {
    return this._items.indexOf(value);
  }

  /**
   * Length
   */
  get length() {
    return this._items.length;
  }

  each(callback: (value: Collection, index: number, array: Collection[], thisArg?: any) => any) {
    return this._items.map(callback);
  }
}
