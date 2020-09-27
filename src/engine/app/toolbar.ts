// functions related to the toolbar
export class PGToolbar {
  activeTool: any;
  previousTool: any;

  setup = () => {
    this.setupToolList();
  };

  setupToolList = () => {
    const toolList = pg.tools.getToolList();
    const $toolsContainer = jQuery('.toolsContainer');

    jQuery.each(toolList, (index: number, tool: any) => {
      if (tool.type === 'hidden') {
        return;
      }

      let shortCutInfo = '';
      if (tool.usedKeys && tool.usedKeys.toolbar !== '') {
        shortCutInfo = ' (' + (tool.usedKeys.toolbar).toUpperCase() + ')';
      }
      const $tool = jQuery('<div class="tool_' + tool.id + ' tool" data-id="' + tool.id + '" title="' + tool.name + shortCutInfo + '">');
      $tool.click(() => {
        this.switchTool(tool.id);
      });
      $toolsContainer.append($tool);
    });

    pg.statusbar.update();

    // set select tool as starting tool. timeout is needed...
    setTimeout(() => {
      if (paper.tools.length > 0) {
        paper.tools[0].remove(); // remove default tool
      }
      this.setDefaultTool();
    }, 300);
  };

  getActiveTool = () => {
    return this.activeTool;
  };

  getPreviousTool = () => {
    return this.previousTool;
  };

  switchTool = (toolID: string, forced?: boolean) => {
    try {
      const opts = pg.tools.getToolInfoByID(toolID);
      const tool = new pg.tools[toolID]();

      // writing the tool infos back into the tool.options object
      jQuery.each(opts, (name: string, value: string) => {
        tool.options[name] = value;
      });

      // don't switch to the same tool again unless "forced" is true
      if (
        this.activeTool &&
        this.activeTool.options.id === tool.options.id &&
        !forced
      ) {
        return;
      }

      // don't assign a hidden tool to previous tool state
      // that is only useful/wanted for toolbar items
      if (
        this.activeTool && this.activeTool.options.type !== 'hidden'
      ) {
        this.previousTool = this.activeTool;
      }
      this.resetTools();
      pg.stylebar.sanitizeSettings();
      tool.activateTool();
      this.activeTool = tool;
      jQuery('.tool_' + toolID + '').addClass('active');

    } catch (error) {
      console.warn('The tool with the id "' + toolID + '" could not be loaded.', error);
    }
  };

  resetTools = () => {
    if (this.activeTool) {
      try {
        this.activeTool.deactivateTool();
      } catch (e) {
        // this tool has no (optional) deactivateTool function
      }
      for (let i = 0; i < paper.tools.length; i++) {
        paper.tools[i].remove();
      }
    }
    jQuery('.toolOptionPanel').remove();
    jQuery('.tool').removeClass('active');
  };

  setDefaultTool = () => {
    this.switchTool('select');
  };
}
