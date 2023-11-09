import { children } from './data';

export const getChildren = ({ parentId }: { parentId: string, }) => {
    return children[parentId];
}

export const getAllChildren = () => {
    return children;
}

export const getChildrenIndex = ({ parentId, contentId }: { parentId: string, contentId: string }) => {
    if (children[parentId]) {
        return children[parentId].findIndex(value => value.contentId === contentId);
    }
    else {
        return -1;
    }
}
