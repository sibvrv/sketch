import {Component, h, PreactDOMAttributes} from 'preact';
import './Button.less';

/**
 * Button Props Interface
 */
interface ButtonProps extends JSX.HTMLAttributes {
  type?: 'default' | 'primary' | 'info' | 'success' | 'mint' | 'warning' | 'danger' | 'pink' | 'purple' | 'dark';
}

/**
 * Button State Interface
 */
interface ButtonState {
}

/**
 * Button
 * @class Button
 * @extends Component
 */
export default class Button extends Component<ButtonProps, ButtonState> {
  /**
   * Default Props for Button Component
   */
  static defaultProps: ButtonProps = {
    type: 'default'
  };

  /**
   * Button Component Constructor
   * @param {ButtonProps} props
   */
  constructor(props: ButtonProps) {
    super(props);
    this.state = {};
  }

  /**
   * Render Button Component
   */
  render({type, children, ...props}: ButtonProps & PreactDOMAttributes & JSX.HTMLAttributes, {}: ButtonState) {
    return (
      <div {...props} class={[`btn btn-${type}`, props['class'] || '']}>
        {children}
      </div>
    );
  }
}
