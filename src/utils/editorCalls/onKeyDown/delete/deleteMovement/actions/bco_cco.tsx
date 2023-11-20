import { EditorStateContentType } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getContent, removeChildrenData, updateContentChildren, upsetChildren, upsetContent } from '@/utils/editors/data';
import { childIntegration } from '@/utils/render';
import { v4 } from 'uuid';

export const bco_cco = (
    {
        beforeContent,
        currentContent
    }: {
        beforeContent: EditorStateContentType,
        currentContent: EditorStateContentType
    }) => {
    const previousNode = document.getElementById(beforeContent.id)
    const currentNode = document.getElementById(currentContent.id)

    const newBeforeContent = {
        ...beforeContent,
        id: v4(),
        parentId: beforeContent.id,
    }

    const newContent = {
        ...currentContent,
        id: v4(),
        parentId: beforeContent.id,
    }

    newBeforeContent.type = "P"
    newContent.type = "P"


    let newChildren = [
        {
            contentId: newBeforeContent.id,
            parentId: beforeContent.id
        },
        {
            contentId: newContent.id,
            parentId: beforeContent.id
        }
    ];


    upsetContent({ id: newContent.id, value: newContent })
    upsetContent({ id: newBeforeContent.id, value: newBeforeContent })
    upsetChildren({ value: newChildren, parentId: beforeContent.id })
    updateContentChildren({ childrenId: beforeContent.id, id: beforeContent.id })
    removeChildrenData({ parentId: parentClass, contentId: currentContent.id })

    const content = getContent({ id: beforeContent.id });
    const newChild = childIntegration({ editorStateData: content })
    if (previousNode)
        previousNode.replaceWith(newChild);
    if (currentNode) currentNode.remove()

    updateCaretToMatch({ id: newContent.id, currentPosition: 0 })

}