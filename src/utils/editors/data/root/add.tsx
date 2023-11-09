import { getRootIndex } from './get';
import { root } from './data';

export const addRoot = ({ contentId }: { contentId: string }) => {
    const index = getRootIndex({ contentId })
    if (index < 0)
        root.push(contentId);
}

export const insertRoot = ({ contentId, index }: { contentId: string, index: number }) => {
    if (index <= root.length) {
        root.splice(index, 0, contentId);
    }
}