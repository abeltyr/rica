import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { removeChildrenContent } from '@/utils/editors/data';

export const bco_cco_empty = (
    {
        beforeContentId,
        currentContentId
    }: {
        beforeContentId: string,
        currentContentId: string
    }) => {
    const currentNode = document.getElementById(currentContentId)
    if (currentNode) currentNode.remove()
    removeChildrenContent({ parentId: parentClass, contentId: currentContentId })
    updateCaretToMatch({ id: beforeContentId, currentPosition: -1 })
}