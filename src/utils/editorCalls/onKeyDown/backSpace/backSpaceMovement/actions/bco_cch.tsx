import { EditorStateContentType, ValueType } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getChildren, getContent, mergeContent, removeChildren, removeChildrenContent, removeChildrenData, removeContent, updateContentChildren, updateParentContent, updateValueContent, upsetChildren, upsetContent } from '@/utils/editors/data';
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

    let caretPosition = 0;
    const { mergedContent } = mergeContent({
        firstContent: beforeContent,
        secondContent: currentContent,
    })



    let newChildren: ValueType[] = []

    if (mergedContent) {
        removeChildren({ parentId: mergedContent.id })
        upsetContent({
            id: mergedContent.id,
            value: mergedContent,
        })
        caretPosition = (mergedContent.content ?? "").length - (beforeContent.content ?? "").length
    } else {
        const newContent: EditorStateContentType = {
            ...beforeContent,
            id: v4(),
            parentId: beforeContent.id,
            type: "P"
        }
        newChildren = [
            {
                contentId: newContent.id,
                parentId: beforeContent.id
            }
        ]
        upsetContent({ id: newContent.id, value: newContent })

    }

    currentChildren.forEach((value, _) => {
        newChildren =
            [
                ...newChildren,
                {
                    contentId: value.contentId,
                    parentId: beforeContent.id
                }
            ]
        updateParentContent({ id: value.contentId, parentId: beforeContent.id })
    })


    upsetChildren({ value: newChildren, parentId: beforeContent.id })
    updateContentChildren({ childrenId: beforeContent.id, id: beforeContent.id })


    upsetChildren({ parentId: currentContent.id, value: [] })
    removeChildrenContent({ parentId: parentClass, contentId: currentContent.id })

    const content = getContent({ id: beforeContent.id });

    const newChild = childIntegration({ editorStateData: content })
    if (previousNode)
        previousNode.replaceWith(newChild);
    if (currentNode) currentNode.remove()

    updateCaretToMatch({ id: id, currentPosition: caretPosition })

}