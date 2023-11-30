import { EditorStateContentType } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getChildren, getContent, mergeContent, removeChildren, removeChildrenContent, updateValueContent, upsetChildren, upsetContent } from '@/utils/editors/data';
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
    const previousNode = document.getElementById(beforeContentId)
    const currentNode = document.getElementById(currentContent.id)

    let beforeChildren = getChildren({ parentId: beforeContentId });
    const beforeContent = getContent({ id: beforeContentId });



    const { mergedContent } = mergeContent({
        firstContent: beforeContent,
        secondContent: currentContent,
    })


    if (mergedContent) {
        removeChildren({ parentId: mergedContent.id })
        removeChildrenContent({
            parentId: parentClass,
            contentId: currentContent.id
        })

        if (mergedContent.content)
            updateValueContent({
                id: mergedContent.id,
                value: mergedContent.content,
            })
        else {
            upsetContent({
                id: mergedContent.id,
                value: mergedContent,
            })
            const newChild = childIntegration({
                editorStateData: mergedContent
            })
            const previousNode = document.getElementById(mergedContent.id)
            if (previousNode)
                previousNode.replaceWith(newChild);
        }
        if (currentNode) currentNode.remove()

        const caretPosition = (mergedContent.content ?? "").length - (currentContent.content ?? "").length;
        updateCaretToMatch({ id: mergedContent.id, currentPosition: caretPosition })
    } else {
        // update the currentContent id
        const newContent: EditorStateContentType = {
            ...currentContent,
            id: v4(),
            parentId: beforeContentId,
            type: "P"
        }

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


}