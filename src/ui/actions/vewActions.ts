export interface ViewActionsInterface {
  setZoom?: (zoom: number) => void;
}

export const viewActions = () => ({
  /**
   * Set View Port Zoom
   * @param zoom
   */
  setZoom({}, zoom: number) {
    return {
      main: {
        zoom
      }
    };
  }
});
