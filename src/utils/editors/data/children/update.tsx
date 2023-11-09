import { EditorChildrenType, ValueType } from '@/interface/editor';
import { children } from './data';
import { getChildrenIndex } from './get';

export const upsetChildren = ({ parentId, value }: { parentId: string, value: ValueType[] }) => {
    children[parentId] = value;
}


// TODO: check if this will be used
export const updateChildrenValue = (
    {
        parentId,
        contentId
    }: {
        parentId: string,
        contentId: string
    }) => {
    const contentIndex = getChildrenIndex({ contentId, parentId })
    if (children[parentId] && contentIndex) {
        children[parentId][contentIndex] = {
            contentId,
            parentId,
        };
    }
}


export const moveChildren = (
    {
        parentId,
        currentIndex,
        newIndex
    }: {
        parentId: string,
        currentIndex: number
        newIndex: number
    }) => {
    if (children[parentId] && children[parentId][currentIndex] && newIndex <= children[parentId].length) {
        const childValue = children[parentId][currentIndex];
        children[parentId].splice(newIndex, 0, childValue);
        children[parentId].splice(currentIndex, 1);
    }
}


export const mergeChildren = (
    {
        firstChildId,
        lastChildId,
        firstChildIndex,
        lastChildIndex,
    }: {
        firstChildId: string,
        lastChildId: string,
        firstChildIndex: number
        lastChildIndex: number
        forward?: boolean
    }) => {
    if (children[firstChildId] && children[lastChildId]) {
        let firstChild = [...children[firstChildId]];
        let lastChild = [...children[lastChildId]];
        firstChild = firstChild.slice(0, firstChildIndex);;
        lastChild = lastChild.slice(lastChildIndex, children[lastChildId].length - 1);

        const newChild = [...firstChild, ...lastChild];
        children[firstChildId] = newChild;
        delete children[lastChildId];
    }
}