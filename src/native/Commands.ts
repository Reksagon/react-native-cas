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
