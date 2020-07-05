import {Component, h, PreactDOMAttributes} from 'preact';

/**
 * IMenuItem Props Interface
 */
interface IMenuItemProps extends JSX.HTMLAttributes, PreactDOMAttributes {
}

/**
 * IMenuItem State Interface
 */
interface IMenuItemState {
}

/**
 * MenuItem
 * @class MenuItem
 * @extends Component
 */
export default class MenuItem extends Component<IMenuItemProps, IMenuItemState> {
  /**
   * Default Props for MenuItem Component
   */
  public static defaultProps: Partial<IMenuItemProps> = {};

  /**
   * MenuItem Component Constructor
   * @param {IMenuItemProps} props
   */
  constructor(props: Readonly<IMenuItemProps>) {
    super(props);
    this.state = {};
  }

  /**
   * Render MenuItem Component
   */
  public render() {
    const {children, ...other} = this.props;
    const {} = this.state;

    return (
      <li {...other}>
        {children}
      </li>
    );
  }
}
