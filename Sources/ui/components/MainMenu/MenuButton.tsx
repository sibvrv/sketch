import {Component, h, PreactDOMAttributes} from 'preact';

/**
 * IMenuButton Props Interface
 */
interface IMenuButtonProps extends JSX.HTMLAttributes, PreactDOMAttributes {
  open?: boolean;
}

/**
 * MenuButton
 * @class MenuButton
 * @extends Component
 */
export default class MenuButton extends Component<IMenuButtonProps> {
  /**
   * Render MenuButton Component
   */
  public render() {
    const {children, open, ...other} = this.props;

    return (
      <li class={['topMenuButton', open && 'open']} {...other}>{children}</li>
    );
  }
}
