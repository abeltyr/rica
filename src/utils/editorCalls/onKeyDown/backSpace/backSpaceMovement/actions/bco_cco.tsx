import { EditorStateContentType } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getContent, mergeContent, removeChildren, removeChildrenContent, removeChildrenData, removeContent, updateContentChildren, updateValueContent, upsetChildren, upsetContent } from '@/utils/editors/data';
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
    // fetch the node of the two text based root
    const previousNode = document.getElementById(beforeContent.id)
    const currentNode = document.getElementById(currentContent.id)

    /**
     * generate two new content, here the assumption the two content 
     * are the same and are going to be merged
     * */
    const newBeforeContent: EditorStateContentType = {
        ...beforeContent,
        parentId: beforeContent.parentId,
        type: "P"
    }

    const newContent: EditorStateContentType = {
        ...currentContent,
        id: v4(),
        parentId: beforeContent.parentId,
        type: "P"
    }


    const { mergedContent } = mergeContent({
        firstContent: newBeforeContent,
        secondContent: newContent
    });

    // if they are compatible and the are merged we update the first root and the remove the second root
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
            if (previousNode)
                previousNode.replaceWith(newChild);
        }
        if (currentNode) currentNode.remove()

        updateCaretToMatch({ id: mergedContent.id, currentPosition: (beforeContent.content ?? "").length })
    } else {
        // if they are  not compatible the current content is converted to a children based content 


        // update there data to match with the children based structure
        newBeforeContent.id = v4();
        newBeforeContent.parentId = beforeContent.id;
        newContent.parentId = beforeContent.id;

        // add the newly created content
        upsetContent({
            id: newContent.id,
            value: newContent
        })
        upsetContent({
            id: newBeforeContent.id,
            value: newBeforeContent
        })

        let newChildren = [
            {
                contentId: newBeforeContent.id,
                parentId: newBeforeContent.parentId
            },
            {
                contentId: newContent.id,
                parentId: newContent.parentId
            }
        ];



        upsetChildren({
            parentId: beforeContent.id,
            value: newChildren,
        })
        updateContentChildren({
            id: beforeContent.id,
            childrenId: beforeContent.id
        })
        removeChildrenData({
            parentId: parentClass,
            contentId: currentContent.id
        })
        removeContent({ id: currentContent.id })

        const content = getContent({ id: beforeContent.id });
        const newChild = childIntegration({ editorStateData: content })
        if (previousNode)
            previousNode.replaceWith(newChild);
        if (currentNode) currentNode.remove()

        updateCaretToMatch({ id: newContent.id, currentPosition: 0 })
    }



}