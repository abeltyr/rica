import { ValueType } from '@/interface/editor';
import { children } from './data';
import { getChildrenIndex } from './get';
import { getContent, removeContent } from '../content';

export const removeChildren = ({ parentId }: { parentId: string }) => {
    if (children[parentId]) {
        const removingChild: ValueType[] = JSON.parse(JSON.stringify(
            children[parentId]));
        removingChild.map((value, _) => {
            removeChildrenContent({ contentId: value.contentId, parentId: value.parentId ?? parentId });
        })
        if (removingChild.length === 0) {
            delete children[parentId];
        }
    }
}

export const removeChildrenContent = async ({ parentId, contentId }: { parentId: string, contentId: string, }) => {
    const contentIndex = getChildrenIndex({ contentId, parentId })
    if (contentIndex >= 0) {
        children[parentId].splice(contentIndex, 1)
        if (Object.keys(children[parentId]).length === 0) {
            delete children[parentId];
            const data = getContent({ id: parentId });
            if (data.parentId) {
                removeChildrenContent({ contentId: parentId, parentId: data.parentId })
            }
        }
        removeContent({ id: contentId })
        removeChildren({ parentId: contentId })
    }
}

export const removeChildrenData = async ({ parentId, contentId }: { parentId: string, contentId: string, }) => {
    const contentIndex = getChildrenIndex({ contentId, parentId })
    if (contentIndex >= 0) {
        children[parentId].splice(contentIndex, 1)
    }
}