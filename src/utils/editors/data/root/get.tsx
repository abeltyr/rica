import { root } from './data';

export const getRoot = ({ index }: { index: number, }) => {
    return root[index];
}

export const getRoots = () => {
    return [...root];
}


export const getRootLength = () => {
    return root.length;
}

export const getRootIndex = ({ contentId }: { contentId: string }) => {
    return root.findIndex(value => value === contentId);
}