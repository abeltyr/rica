import { parentClass } from '@/utils/commons';
import { removeChildrenContent } from '@/utils/editors/data';

export const bco_empty_cco = (
    {
        beforeContentId,
    }: {
        beforeContentId: string,
    }) => {
    const currentNode = document.getElementById(beforeContentId)
    if (currentNode) currentNode.remove()
    removeChildrenContent({ parentId: parentClass, contentId: beforeContentId })
}