import { UIManager, findNodeHandle } from 'react-native';

export const Commands = {
  loadAd: (ref: any) => {
    const reactTag = findNodeHandle(ref);
    if (!reactTag) return;

    UIManager.dispatchViewManagerCommand(
      reactTag,
      UIManager.getViewManagerConfig('AdView').Commands.loadAd,
      []
    );
  },

  destroy: (ref: any) => {
    const reactTag = findNodeHandle(ref);
    if (!reactTag) return;

    UIManager.dispatchViewManagerCommand(
      reactTag,
      UIManager.getViewManagerConfig('AdView').Commands.destroy,
      []
    );
  },

  startAutoRefresh: (ref: any) => {
    const reactTag = findNodeHandle(ref);
    if (!reactTag) return;

    UIManager.dispatchViewManagerCommand(
      reactTag,
      UIManager.getViewManagerConfig('AdView').Commands.startAutoRefresh,
      []
    );
  },

  stopAutoRefresh: (ref: any) => {
    const reactTag = findNodeHandle(ref);
    if (!reactTag) return;

    UIManager.dispatchViewManagerCommand(
      reactTag,
      UIManager.getViewManagerConfig('AdView').Commands.stopAutoRefresh,
      []
    );
  },

  isAdLoaded: (ref: any): Promise<boolean> => {
    const reactTag = findNodeHandle(ref);
    if (!reactTag) return Promise.resolve(false);

    return new Promise((resolve) => {
      UIManager.dispatchViewManagerCommand(
        reactTag,
        UIManager.getViewManagerConfig('AdView').Commands.isAdLoaded,
        [resolve]
      );
    });
  },
};
