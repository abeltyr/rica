import { EditorChildrenType, ValueType } from '@/interface/editor';
import { children } from './data';
import { getChildrenIndex } from './get';

export const addChildren = (
    {
        parentId,
        value,
    }: {
        parentId: string,
        value: ValueType
    }) => {
    const index = getChildrenIndex({ parentId, contentId: value.contentId })
    if (!index)
        children[parentId].push(value);
}


export const insertChildren = ({ parentId, value, index }: { parentId: string, value: ValueType, index: number }) => {
    if (children[parentId] && index <= children[parentId].length) {
        children[parentId].splice(index, 0, value);
    }
}
