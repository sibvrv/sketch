import {Component, h} from 'preact';

/**
 * ModalSection Props Interface
 */
interface ModalSectionProps {
  name: string;
}

/**
 * ModalSection State Interface
 */
interface ModalSectionState {
}

/**
 * ModalSection
 * @class ModalSection
 * @extends Component
 */
export default class ModalSection extends Component<ModalSectionProps, ModalSectionState> {
  /**
   * Render ModalSection Component
   */
  render() {
    const {children} = this.props as any;
    return children && children[0] || null;
  }
}
