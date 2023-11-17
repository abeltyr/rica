import { EditorStateContentType } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getChildren, getContent, removeChildren, removeChildrenData, updateContentChildren, updateParentContent, upsetChildren, upsetContent } from '@/utils/editors/data';
import { childIntegration } from '@/utils/render';
import { v4 } from 'uuid';

export const bco_cch = (
    {
        id,
        beforeContent,
        currentContent
    }: {
        id: string,
        beforeContent: EditorStateContentType,
        currentContent: EditorStateContentType
    }) => {

    let currentChildren = [...getChildren({ parentId: currentContent.id })];


    const previousNode = document.getElementById(beforeContent.id)
    const currentNode = document.getElementById(currentContent.id)

    const newContent = {
        ...beforeContent,
        id: v4(),
        parentId: beforeContent.id,
    }
    newContent.type = "P"

    let newChildren = [
        {
            contentId: newContent.id,
            parentId: beforeContent.id
        }
    ]

    currentChildren.forEach((value, _) => {
        newChildren =
            [
                ...newChildren,
                {
                    contentId: value.contentId,
                    parentId: beforeContent.id
                }
            ]
    })

    upsetContent({ id: newContent.id, value: newContent })
    updateParentContent({ id: currentContent.id, parentId: beforeContent.id, })
    upsetChildren({ value: newChildren, parentId: beforeContent.id })
    updateContentChildren({ childrenId: beforeContent.id, id: beforeContent.id })
    removeChildrenData({ parentId: parentClass, contentId: currentContent.id })
    upsetChildren({ parentId: currentContent.id, value: [] })
    removeChildren({ parentId: currentContent.id })

    const content = getContent({ id: beforeContent.id });

    const newChild = childIntegration({ editorStateData: content })
    if (previousNode)
        previousNode.replaceWith(newChild);
    if (currentNode) currentNode.remove()

    updateCaretToMatch({ id: id, currentPosition: 0 })
}