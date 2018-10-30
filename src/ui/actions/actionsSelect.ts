import GLOB from '@root/types';
import defaultStorage from '@store/defaultStorage';

export function selected_info() {
  const status: string[] = [];

  const {editor} = GLOB;
  const {selected} = editor;
  const visible = Boolean(selected.sector || selected.point || selected.line);

  if (selected.sector) {
    status.push(`Area: ${selected.sector.getArea().toFixed(2)}`);
    status.push(`Vertex: ${selected.sector.path.length}`);
  } else {
    status.push(`Items: ${editor.layer.length}`);
  }

  defaultStorage.setState({
    status: status.join(' '),
    selectedChange: Math.random(),
    shapeOptionsVisible: visible
  });
}
