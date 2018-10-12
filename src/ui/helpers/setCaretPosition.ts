/**
 * Set Caret Position
 * @param caretPos
 * @param in_element
 */
export function setCaretPosition(in_element: HTMLElement, caretPos: number) {
  const element = in_element as any; // TODO fix me
  if (!element) {
    return;
  }

  if (element.setSelectionRange) {
    element.setSelectionRange(caretPos, caretPos);
  } else if (element.createTextRange) {
    const range = element.createTextRange();
    range.move('character', caretPos);
    range.select();
  } else if (element.selectionStart) {
    element.setSelectionRange(caretPos, caretPos);
  } else { // for content Editable
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(element, caretPos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  element.focus();
}
