import {Component, h} from 'preact';
import {Store} from 'unistore';
import {loopv} from '@Framework/common/loops';
import {getDescendantProp} from '@Framework/common/getDescendantProp';

export interface IStoresObject {
  [storeName: string]: Store<any>;
}

export interface IStateObject {
  [storeName: string]: object;
}

type TStateToPropsFunc = (states: IStateObject, props: object, stores: IStoresObject) => object;

/**
 * StoreConnection Props Interface
 */
interface StoreConnectionProps {
}

/**
 * StoreConnection State Interface
 */
interface StoreConnectionState {
}

/**
 * Extract namespace from string
 * @param {object} object
 * @param {string} value
 */
function unpackNamespace(object: any, value: string) {
  const [alias, properties] = (value.indexOf(':') >= 0 ? value : `:${value}`).split(':');
  const [namespace, ...values] = (properties.indexOf('.') >= 0 ? properties : `.${properties}`).split('.');
  const key = namespace || 'main';
  (object[key] = object[key] || {})[alias || values.join('_')] = values;
}

/**
 * Custom select with namespace support
 * @param properties
 */
function namespaceSelect(properties: any): TStateToPropsFunc {
  if (typeof properties === 'string') {
    const select: {
      [key: string]: any;
    } = {};
    properties.replace(/\s/g, '').split(/\s*,\s*/).map(item => unpackNamespace(select, item));
    return (states) => {
      const result: any = {};
      loopv(select, (items, namespace) => {
        if (!(namespace in states)) {
          console.error(`Connect to stores: namespace "${namespace}" not found.`);
          return;
        }
        for (const i in items) {
          result[i] = getDescendantProp(states[namespace], items[i]);
        }
      });
      return result;
    };
  } else {
    return properties;
  }
}

/**
 * Get States From Stores
 * @param {IStoresObject} list
 * @returns {{}}
 */
function getStatesFromStores(list: IStoresObject) {
  const values: any = {};
  loopv(list, (store, key) => {
    values[key] = store && store.getState() || {};
  });
  return values;
}

export default function connectToStores(mapStateToProps: string | TStateToPropsFunc,
                                        stores?: IStoresObject | ((states: StoreConnectionProps) => IStoresObject),
                                        actions?: (stores: IStoresObject) => any): any {

  const getPropsFromStates = namespaceSelect(mapStateToProps);

  return (UserComponent: any) => {
    /**
     * StoreConnection
     * @class StoreConnection
     * @extends Component
     */
    class StoreConnection extends Component<StoreConnectionProps, StoreConnectionState> {

      storesList: IStoresObject;
      actionsList: any;

      constructor(props: StoreConnectionProps, context: any) {
        super(props);
        const initialStores = this.storesList = {'main': context && context.store, ...(typeof stores === 'function' ? stores(props) : stores) || {}};
        this.actionsList = typeof actions === 'function' ? actions(initialStores) : {};
        loopv(this.actionsList, (action: any, key: string) => {
          this.actionsList[key] = this.action(action);
        });

        this.state = getPropsFromStates(getStatesFromStores(initialStores), this.props, initialStores);
      }

      action = (action: (states: IStateObject, ...args: any[]) => object) => {
        return (...args: any[]) => {
          const storesList = this.storesList;
          const result = action(getStatesFromStores(storesList), ...args);
          loopv(result, (states: any, key: string) => storesList[key].setState(states));
        };
      };

      componentDidMount() {
        loopv(this.storesList, store => store.subscribe(this.handleStateChanged));
        this.handleStateChanged();
      }

      componentWillUnmount() {
        loopv(this.storesList, store => store.unsubscribe(this.handleStateChanged));
      }

      handleStateChanged = () => {
        const state = getPropsFromStates(getStatesFromStores(this.storesList), this.props, this.storesList) as any;
        for (const i in state) {
          if (state[i] !== (this.state as any)[i]) {
            this.state = state;
            return this.setState(null!);
          }
        }
      };

      render() {
        return <UserComponent {...this.actionsList} {...this.props} {...this.state} />;
      }
    }

    return StoreConnection;
  };
}
