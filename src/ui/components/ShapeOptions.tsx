import {Component, h, PreactDOMAttributes} from 'preact';
import connectToStores from '@store/connectToStores';
import GLOB from '@root/types';
import {redraw} from '@root/main';
import './ShapeOptions.less';

/**
 * ShapeOptions Props Interface
 */
interface ShapeOptionsProps {
  selectedChange?: number;
}

/**
 * ShapeOptions State Interface
 */
interface ShapeOptionsState {
  type: string;
  name: string;
  mask: boolean;
  radius: number;
  steps: number;
}

/**
 * ShapeOptions
 * @class ShapeOptions
 * @extends Component
 */
@connectToStores('selectedChange')
export default class ShapeOptions extends Component<ShapeOptionsProps, ShapeOptionsState> {
  /**
   * Default Props for ShapeOptions Component
   */
  static defaultProps: ShapeOptionsProps = {};

  /**
   * ShapeOptions Component Constructor
   * @param {ShapeOptionsProps} props
   */
  constructor(props: ShapeOptionsProps) {
    super(props);
    this.state = {
      name: '',
      type: '',
      mask: false,
      radius: 0,
      steps: 1
    };
    this.updateState();
  }

  updateState() {
    const {selected} = GLOB.editor;
    const type = (selected.point && 'point') || (selected.line && 'line') || (selected.sector && 'shape') || 'none';

    this.setState({
      type,
      name: selected.sector && selected.sector.props('name') as string,
      mask: selected.sector && selected.sector.props('mask') as boolean,
      radius: selected.point && selected.point.r || 0,
      steps: selected.point && selected.point.steps || 1
    });
  }

  componentWillReceiveProps() {
    this.updateState();
  }

  /**
   * ShapeOptions : Set Name Handler
   */
  handleSetName = (e: Event) => {
    const {value} = (e.target as HTMLInputElement);
    const shape = GLOB.editor.selected.sector;
    shape.props({name: value});
  };

  /**
   * ShapeOptions : Radius Handler
   */
  handleRadius = (e: Event) => {
    const {value} = (e.target as HTMLInputElement);
    const {point} = GLOB.editor.selected;
    point.r = +value;
    redraw();
  };

  /**
   * ShapeOptions : Steps Handler
   */
  handleSteps = (e: Event) => {
    const {value} = (e.target as HTMLInputElement);
    const {point} = GLOB.editor.selected;
    point.steps = +value;
    redraw();
  };

  /**
   * ShapeOptions : Mask Handler
   */
  handleMask = (e: Event) => {
    const {checked} = (e.target as HTMLInputElement);
    const shape = GLOB.editor.selected.sector;
    shape.props({mask: checked});
    redraw();
  };

  /**
   * Render ShapeOptions Component
   */
  render({selectedChange}: ShapeOptionsProps & PreactDOMAttributes, {type, name, mask, radius, steps}: ShapeOptionsState) {
    return (
      <div class="optionsEditor window">
        <p><label>Объект <input type="text" value={name} onInput={this.handleSetName}
                                onChange={this.handleSetName}/></label></p>
        <p><label>Маска <input type="checkbox" checked={mask} onChange={this.handleMask}/></label></p>

        {type === 'point' && [
          <p><label>Радиус <input type="number" step="1" min="0" max="1000" value={radius} onInput={this.handleRadius}
                                  onChange={this.handleRadius}/></label></p>,
          <p><label>Шаг <input type="number" min="0" value={steps} onInput={this.handleSteps}
                               onChange={this.handleSteps}/></label></p>
        ]}

        {/*
                <p><label> Заливка: <input type="color" id="opt-fill"/></label></p>
                <p><label> Обводка: <input type="color" id="opt-stroke"/></label></p>
                <p><label> Прозрачность: <input type="range" step="0.01" min="0" max="1" value="1" id="opt-stroke-opacity"/></label></p>
                <p><label>
                    Углы:
                    <select id="opt-stroke-linejoin">
                        <option value="miter">Прямые</option>
                        <option value="round">Скругленные</option>
                        <option value="bevel">Обрубленные</option>
                    </select>
                </label></p>
            */}
        {/*
        <div class="options options__rect">
          <p><label>x <input type="number"/></label></p>
          <p><label>y <input type="number"/></label></p>
          <p><label>rx <input type="number" min="0" value="0" id="opt-rx"/></label></p>
          <p><label>ry <input type="number" min="0" value="0" id="opt-ry"/></label></p>
        </div>
        <div class="options options__circle hidden">
          <p><label>cx <input type="number"/></label></p>
          <p><label>cy <input type="number"/></label></p>
          <p><label>r <input type="number"/></label></p>
        </div>
        */}
      </div>
    );
  }
}
