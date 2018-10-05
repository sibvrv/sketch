import {Component, h, PreactDOMAttributes} from 'preact';

/**
 * ToolsBar Props Interface
 */
interface ToolsBarProps {
}

/**
 * ToolsBar State Interface
 */
interface ToolsBarState {
  selected: string;
}

interface ToolButtonProps {
  name?: string;
  title?: string;
  children?: JSX.Element | JSX.Element[];
}

const ToolButton = ({name, title, children}: ToolButtonProps, {selected, onClick}: { selected: string, onClick: JSX.MouseEventHandler }) =>
  <button id={name} title={title} class={[selected === name && 'selected']} onClick={onClick}>{children}</button>;

/**
 * ToolsBar
 * @class ToolsBar
 * @extends Component
 */
export default class ToolsBar extends Component<ToolsBarProps, ToolsBarState> {
  /**
   * Default Props for ToolsBar Component
   */
  static defaultProps: ToolsBarProps = {};

  /**
   * ToolsBar Component Constructor
   * @param {ToolsBarProps} props
   */
  constructor(props: ToolsBarProps) {
    super(props);
    this.state = {
      selected: 'btn-select'
    };
  }

  getChildContext() {
    return {selected: this.state.selected, onClick: this.handleClick};
  }

  /**
   * ToolsBar : Click Handler
   */
  handleClick = (e: Event) => {
    e.preventDefault();
    this.setState({
      selected: (e.currentTarget as HTMLElement).id
    });
  };

  /**
   * Render ToolsBar Component
   */
  render({children}: ToolsBarProps & PreactDOMAttributes, {}: ToolsBarState) {
    return (
      <div id="tools" class="window">
        <ToolButton name="btn-select" title="Select / transform">
          <svg class="fill">
            <path d="M3,0l11.5,11.5h-5l3,5l-1.5,1l-4.2,-6.2l-3.8,5z"/>
          </svg>
        </ToolButton>
        <ToolButton name="btn-zoom" title="Zoom">
          <svg class="stroke">
            <circle cx="7" cy="7" r="6"/>
            <path d="M11,11l7,7"/>
          </svg>
        </ToolButton>
        <ToolButton name="btn-poly" title="Polygon">
          <svg class="stroke">
            <path d="M1,1L17,9L4,17z"/>
          </svg>
        </ToolButton>
        <ToolButton name="btn-rect" title="Rectangle">
          <svg class="stroke">
            <path d="M2,2h14v14H2z"/>
          </svg>
        </ToolButton>
        <ToolButton name="btn-circle" title="Circle">
          <svg class="stroke">
            <circle cx="9" cy="9" r="8"/>
          </svg>
        </ToolButton>
        <ToolButton name="btn-ellipse" title="Ellipse">
          <svg class="stroke">
            <ellipse cx="9" cy="9" rx="8" ry="6" transform="rotate(45 9 9)"/>
          </svg>
        </ToolButton>
        <ToolButton name="btn-polyline" title="Polyline">
          <svg class="stroke">
            <path d="M1,1L17,9L13,17H3V12"/>
          </svg>
        </ToolButton>
        <ToolButton name="btn-text" title="Text">
          <svg class="stroke">
            <path d="M0,17h5M2.5,17L9,1L16,17M5,11h8M13,17h5"/>
          </svg>
        </ToolButton>
      </div>
    );
  }
}
