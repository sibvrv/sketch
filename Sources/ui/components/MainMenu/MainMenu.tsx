import {Component, h, PreactDOMAttributes} from 'preact';
import './MainMenu.less';

export interface IMenuItem {
  id?: string;
  title: string | JSX.Element;
  class?: string | string[];
  items?: IMenuItem[];
  parent?: IMenuItem;
}

/**
 * IMainMenu Props Interface
 */
interface IMainMenuProps extends PreactDOMAttributes {
  items: IMenuItem[];
}

/**
 * IMainMenu State Interface
 */
interface IMainMenuState {
  menu: IMenuItem[];
  active: {
    [index: string]: boolean;
  };
}

/**
 * MainMenu
 * @class MainMenu
 * @extends Component
 */
export default class MainMenu extends Component<IMainMenuProps, IMainMenuState> {
  /**
   * Default Props for MainMenu Component
   */
  public static defaultProps: Partial<IMainMenuProps> = {};

  /**
   * MainMenu Component Constructor
   * @param {IMainMenuProps} props
   */
  constructor(props: Readonly<IMainMenuProps>) {
    super(props);
    this.state = {
      menu: [],
      active: {}
    };

    this.updateMenu(props.items);
  }

  outsideClick = () => {
    if (!Object.keys(this.state.active).length) {
      return;
    }
    this.setState({
      active: {}
    });
  }

  componentWillMount() {
    window.addEventListener('click', this.outsideClick, false);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.outsideClick, false);
  }

  updateMenu(menu: IMenuItem[]) {

    const walk = (item: IMenuItem) => {
      if (!item.id) {
        item.id = `${Math.random().toString(32).substr(2)}-${Math.random().toString(32).substr(2)}`;
      }

      (item.items! || []).forEach((it) => {
        it.parent = item;
        walk(it);
      });
    };

    menu.forEach(item => walk(item));

    this.setState({
      menu
    });
  }

  /**
   * MainMenu : MenuClick Handler
   */
  handleMenuClick = (level: number, item: IMenuItem) => {
    const active: { [index: string]: boolean } = {};
    let it = item;
    if (it.id) {
      active[it.id] = !Boolean(this.state.active[it.id]);
    }
    it = item.parent!;
    while (it) {
      if (it.id) {
        active[it.id] = true;
      }
      it = it.parent!;
    }

    this.setState({
      active
    });
  };

  /**
   * Render Menu Items
   * @param item
   * @param level
   */
  renderItem(item: IMenuItem, level: number) {
    const items = (item.items || []).map((it: any) => this.renderItem(it, level + 1));
    const isOpen = item.id ? this.state.active[item.id] : false;
    return (
      <li class={[`menu-item level-${level}`, isOpen && `open`, item.class]} onClick={(e) => {
        e.stopPropagation();
        this.handleMenuClick(level, item);
      }}>
        {item.title}{isOpen && items.length ? <ul class={[`sub-menu level-${level}`, isOpen && `open`]}>{items}</ul> : null}
      </li>
    );
  }

  /**
   * Render MainMenu Component
   */
  public render() {
    const {menu} = this.state;

    return (
      <nav class="appNav">
        <ul class="topMenu">
          {menu.map((item) => this.renderItem(item, 1))}
        </ul>
      </nav>
    );
  }
}
