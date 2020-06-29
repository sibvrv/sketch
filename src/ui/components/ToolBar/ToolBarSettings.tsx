import {Component, h, PreactDOMAttributes} from 'preact';
import * as style from './ToolBar.less';
import defaultStorage from '@store/defaultStorage';
import {redraw} from '@root/main';

/**
 * ToolBarSettings Props Interface
 */
interface ToolBarSettingsProps extends PreactDOMAttributes {
}

/**
 * ToolBarSettings State Interface
 */
interface ToolBarSettingsState {
  selected: string;
  active: boolean;
}

interface ToolButtonProps {
  name?: string;
  title?: string;
  className?: string;
  active?: boolean;
  children?: JSX.Element | JSX.Element[];
}

const ToolButton = (
  {name, title, className, children}: ToolButtonProps,
  {selected, active, onClick}: { selected: string, active: boolean, onClick: JSX.MouseEventHandler }) =>
  <button id={name} title={title} class={[selected === name && style.selected, active && style.active, className]} onClick={onClick}>{children}</button>;

/**
 * ToolBarSettings
 * @class ToolBarSettings
 * @extends Component
 */
export default class ToolBarSettings extends Component<ToolBarSettingsProps, ToolBarSettingsState> {
  /**
   * Default Props for ToolBarSettings Component
   */
  static defaultProps: ToolBarSettingsProps = {};

  /**
   * ToolBarSettings Component Constructor
   * @param {ToolBarSettingsProps} props
   */
  constructor(props: Readonly<ToolBarSettingsProps>) {
    super(props);
    this.state = {
      selected: 'btn-grid',
      active: defaultStorage.getState().drawGrid
    };
  }

  getChildContext() {
    return {selected: this.state.selected, active: this.state.active, onClick: this.handleClick};
  }

  /**
   * ToolBarSettings : Click Handler
   */
  handleClick = (e: Event) => {
    e.preventDefault();
    const selected = (e.currentTarget as HTMLElement).id;
    let active = false;

    if (selected === 'btn-grid') {
      active = !defaultStorage.getState().drawGrid;
      defaultStorage.setState({
        drawGrid: active
      });
      redraw();
    }

    this.setState({
      selected,
      active
    });
  };

  /**
   * Render ToolBarSettings Component
   */
  render() {
    const {} = this.props;
    const {} = this.state;

    return (
      <div class={style.settings_bar}>
        <ToolButton name="btn-grid" className={style.grid_icon} title="Show Grid">
          <svg class={`${style.icon}`} viewBox="0 0 496 496">
            <path
              d="M432 432v24H64v-24H40V64h24V0H0v64h24v368H0v64h64v-24h368v24h64v-64h-64zM16 48V16h32v32H16zm32 432H16v-32h32v32zm432 0h-32v-32h32v32z"/>
            <path
              d="M480 16H80v400h400V16zM128 400H96v-32h32v32zm0-48H96v-32h32v32zm0-48H96v-32h32v32zm0-48H96v-32h32v32zm0-48H96v-32h32v32zm0-48H96v-32h32v32zm0-48H96V80h32v32zm0-48H96V32h32v32zm48 336h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32V80h32v32zm0-48h-32V32h32v32zm48 336h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32V80h32v32zm0-48h-32V32h32v32zm48 336h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32V80h32v32zm0-48h-32V32h32v32zm48 336h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32V80h32v32zm0-48h-32V32h32v32zm48 336h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32V80h32v32zm0-48h-32V32h32v32zm48 336h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32V80h32v32zm0-48h-32V32h32v32zm48 336h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32v-32h32v32zm0-48h-32V80h32v32zm0-48h-32V32h32v32z"/>
          </svg>
        </ToolButton>
      </div>
    );
  }
}
