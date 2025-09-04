import { UIManager, findNodeHandle } from 'react-native';
export const AdViewCommands = {
    loadAd: (ref) => {
        const reactTag = findNodeHandle(ref);
        if (!reactTag)
            return;
        UIManager.dispatchViewManagerCommand(reactTag, UIManager.getViewManagerConfig('AdView').Commands.loadAd, []);
    },
    destroy: (ref) => {
        const reactTag = findNodeHandle(ref);
        if (!reactTag)
            return;
        UIManager.dispatchViewManagerCommand(reactTag, UIManager.getViewManagerConfig('AdView').Commands.destroy, []);
    },
    startAutoRefresh: (ref) => {
        const reactTag = findNodeHandle(ref);
        if (!reactTag)
            return;
        UIManager.dispatchViewManagerCommand(reactTag, UIManager.getViewManagerConfig('AdView').Commands.startAutoRefresh, []);
    },
    stopAutoRefresh: (ref) => {
        const reactTag = findNodeHandle(ref);
        if (!reactTag)
            return;
        UIManager.dispatchViewManagerCommand(reactTag, UIManager.getViewManagerConfig('AdView').Commands.stopAutoRefresh, []);
    },
    isAdLoaded: (ref) => {
        const reactTag = findNodeHandle(ref);
        if (!reactTag)
            return Promise.resolve(false);
        return new Promise((resolve) => {
            UIManager.dispatchViewManagerCommand(reactTag, UIManager.getViewManagerConfig('AdView').Commands.isAdLoaded, [resolve]);
        });
    },
};
