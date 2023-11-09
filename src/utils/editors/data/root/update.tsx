import { getRootIndex } from './get';
import { root } from './data';

export const upsetRoot = ({ index, value }: { index: number, value: string }) => {
    root[index] = value;
}

export const moveRoot = (
    {
        currentIndex,
        newIndex
    }: {
        currentIndex: number
        newIndex: number
    }) => {

    if (root[currentIndex] && newIndex <= root.length) {
        const childValue = root[currentIndex];
        root.splice(newIndex, 0, childValue);
        root.splice(currentIndex, 1);
    }
}