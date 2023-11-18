import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getChildren, getContent, removeChildren, removeChildrenContent, updateParentContent, upsetChildren } from '@/utils/editors/data';
import { childIntegration } from '@/utils/render';

export const bch_cch = async (
    {
        id,
        beforeContentId,
        currentContentId
    }: {
        id: string,
        beforeContentId: string,
        currentContentId: string
    }) => {

    let beforeChildren = getChildren({ parentId: beforeContentId });
    let currentChildren = getChildren({ parentId: currentContentId });

    let newChildren = [...beforeChildren]

    await currentChildren.forEach((value, index) => {
        newChildren = [...newChildren, {
            contentId: value.contentId,
            parentId: beforeContentId
        }];
        updateParentContent({ id: value.contentId, parentId: beforeContentId })
    })

    upsetChildren({ value: newChildren, parentId: beforeContentId })
    upsetChildren({ value: [], parentId: currentContentId })
    removeChildren({ parentId: currentContentId })
    removeChildrenContent({ parentId: parentClass, contentId: currentContentId })

    const previousNode = document.getElementById(beforeContentId)
    const currentNode = document.getElementById(currentContentId)
    const content = getContent({ id: beforeContentId });
    const newChild = childIntegration({ editorStateData: content })
    if (previousNode) previousNode.replaceWith(newChild);
    if (currentNode) currentNode.remove();
    updateCaretToMatch({ id, currentPosition: 0 })
}