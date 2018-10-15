/**
 * Collection
 */
export class Collection {
  private parent: Collection = null!;
  private _items: Collection[] = [];
  private _childrenCount = 0;

  /**
   * Collection Constructor
   */
  constructor(public type: string, parent?: Collection) {
    this.parent = parent || null!;
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

  /**
   * Length
   */
  get length() {
    return this._items.length;
  }
}
