import { EditorStateContentType, ValueType } from '@/interface/editor';
import { v4 } from 'uuid';
import { getContent, getSecondParentValue, updateParentContent, updateValueContent, upsetContent } from '@/utils/editors/data';
import { getChildren, getChildrenIndex } from '@/utils/editors/data/children/index';
import { children } from './data';
import { updateTextValue } from '@/utils/editors/node';

export const rootChildCutter = async ({ parentId, contentId, currentPosition }: { parentId: string, contentId: string, currentPosition: number }) => {

    let newChildren: ValueType[] = [];
    const newParentId = v4();
    let contentValue: string | undefined;

    // first let fetch the first child under the root and the parent of the current content 
    const secondChildrenId = await getSecondParentValue({ contentId, id: contentId, finalId: parentId });

    let currentContentId = contentId
    let childrenData: ValueType[] = await getChildren({ parentId: parentId });
    const childIndex = await getChildrenIndex({ contentId: secondChildrenId, parentId: parentId })

    console.log(contentId, secondChildrenId);

    /**
     *  we check if the secondChildrenId is the same as the content id 
     *  if it is it mean the current selected text is the second child of the root and doesn't have a children but rather a content
     *  so no more action is needed to fetch the content
     */
    if (childIndex >= 0) {
        /**
         * but if it is not it mean second child is a children containing content, 
         * using this secondChildId and contentId we fetch the index of the content from children
         * update the current children and move to newChildren created
         */
        currentContentId = childrenData[childIndex].contentId
        await childrenData.slice(childIndex + 1, childrenData.length).forEach((value, index) => {
            newChildren = [...newChildren, {
                contentId: value.contentId,
                parentId: newParentId
            }]
            updateParentContent({ id: value.contentId, parentId: newParentId })
            children[parentId].splice(childIndex + 1, 1)
        })
    }

    // then let fetch the content to be manipulated
    const currentContent = getContent({ id: currentContentId })

    if (currentContent.content) {
        contentValue = currentContent.content.slice(0, currentPosition);
        updateValueContent({ id: currentContent.id, value: contentValue })
        updateParentContent({ id: currentContent.id, parentId: newParentId })

        const newContentValue = currentContent.content.slice(currentPosition, currentContent.content.length + 1);
        if (newContentValue.length > 1) {
            updateTextValue({ id: currentContent.id, value: contentValue })
            const contentData: EditorStateContentType = {
                id: v4(),
                type: "P",
                className: "",
                direction: "ltr",
                indent: 0,
                content: newContentValue,
                format: null,
                parentId: newParentId
            }
            upsetContent({ id: contentData.id, value: contentData })
            newChildren = [
                {
                    contentId: contentData.id,
                    parentId: newParentId

                }, ...newChildren
            ]
        }

    }
    else if (currentContent.children) {
        const childCollection = await rootChildCutter({ contentId, parentId: currentContent.children, currentPosition })
        children[childCollection.parentId] = childCollection.newChildren
        const contentData: EditorStateContentType = {
            ...currentContent,
            id: childCollection.parentId,
            children: childCollection.parentId,
            content: undefined,
            parentId: newParentId
        }
        upsetContent({ id: contentData.id, value: contentData })
        newChildren = [
            {
                contentId: contentData.id,
                parentId: newParentId
            },
            ...newChildren
        ]
    }

    return { newChildren, parentId: newParentId }
}