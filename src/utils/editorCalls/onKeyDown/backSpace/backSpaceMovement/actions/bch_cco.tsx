import { EditorStateContentType } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getChildren, getContent, removeChildrenContent, upsetChildren, upsetContent } from '@/utils/editors/data';
import { childIntegration } from '@/utils/render';
import { v4 } from 'uuid';

export const bch_cco = (
    {
        beforeContentId,
        currentContent
    }: {
        beforeContentId: string,
        currentContent: EditorStateContentType
    }) => {
    let beforeChildren = getChildren({ parentId: beforeContentId });

    const previousNode = document.getElementById(beforeContentId)
    const currentNode = document.getElementById(currentContent.id)

    // update the currentContent id
    const newContent = {
        ...currentContent,
        id: v4(),
        parentId: beforeContentId,
    }
    newContent.type = "P"


    let newChildren = [...beforeChildren, {
        contentId: newContent.id,
        parentId: beforeContentId
    }]

    upsetChildren({ value: newChildren, parentId: beforeContentId })
    upsetContent({ id: newContent.id, value: newContent })
    removeChildrenContent({ parentId: parentClass, contentId: currentContent.id })

    const content = getContent({ id: beforeContentId });
    const newChild = childIntegration({ editorStateData: content })
    if (previousNode)
        previousNode.replaceWith(newChild);
    if (currentNode) currentNode.remove()

    updateCaretToMatch({ id: newContent.id, currentPosition: 0 })
}