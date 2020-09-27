import {PGToolbar} from '@root/engine/app/toolbar';

class PG {
  toolbar = new PGToolbar();

  init() {
    paper.setup('paperCanvas');
    pg.settings.setup();
    pg.document.setup();
    pg.layer.setup();
    pg.export.setup();
    pg.text.setup();
    pg.menu.setup();
    this.toolbar.setup();
    pg.stylebar.setup();
    pg.statusbar.setup();
    pg.input.setup();
    pg.undo.setup();
    pg.codeEditor.setup();
  }
}

window['pg'] = new PG();
