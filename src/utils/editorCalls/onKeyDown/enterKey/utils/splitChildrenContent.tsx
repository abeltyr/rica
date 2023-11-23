import { EditorStateContentType, ValueType } from '@/interface/editor';
import { getContent, getSecondParentValue, removeContent, updateParentContent, upsetContent } from '@/utils/editors/data/content';
import { splitContent } from '.';
import { getChildren, getChildrenIndex, removeChildren, updateChildrenValue, upsetChildren } from '@/utils/editors/data/children';
import { v4 } from 'uuid';

export const splitChildrenContent = (
    {
        contentData,
        caretPosition,
        updatedParentId,
        newParentId,
        contentId
    }: {
        contentData: EditorStateContentType,
        caretPosition: number,
        updatedParentId?: string,
        newParentId?: string,
        contentId: string
    }) => {


    let updatedChildren: ValueType[] = [];
    let newChildren: ValueType[] = [];



    if (contentData.content) {
        let { updatedContent, newContent } = splitContent({ caretPosition, contentData, newRootId: newParentId, updatedParentId })
        if (newContent) newChildren = [{
            contentId: newContent.id,
            parentId: newParentId
        }, ...newChildren]
        if (updatedContent) updatedChildren = [...updatedChildren, {
            contentId: updatedContent.id,
            parentId: updatedParentId
        }]
    }

    if (contentData.children) {
        // first we fetch the index of where the cursor is in perspective of the parent
        const secondContentId = getSecondParentValue({ contentId, finalId: contentData.id })
        const secondLayerIndex = getChildrenIndex({ contentId: secondContentId, parentId: contentData.id });
        const currentChildren: ValueType[] = getChildren({ parentId: contentData.id });

        // divide the children on the parents based on the index calculated above excluding the index based value
        updatedChildren = currentChildren.slice(0, secondLayerIndex)
        newChildren = currentChildren.slice(secondLayerIndex + 1, currentChildren.length)


        newChildren.map((value, index) => {
            updateParentContent({ id: value.contentId, parentId: newParentId })
            newChildren[index].parentId = newParentId;
            updateChildrenValue({
                contentId: value.contentId,
                parentId: value.parentId,
                value: {
                    contentId: value.contentId, parentId: newParentId
                }
            })
        })

        // check if the 
        if (!currentChildren[secondLayerIndex]) return
        const indexContent = getContent({ id: currentChildren[secondLayerIndex].contentId });


        if (indexContent) {
            console.log("indexContent", indexContent)

            // generate the new contents where the  divided section are going to go to
            const newIndexContentId = v4();
            let newIndexContent: EditorStateContentType = {
                ...indexContent,
                id: newIndexContentId,
                parentId: newParentId,
                content: undefined,
                children: newIndexContentId
            }

            let updatedIndexContent: EditorStateContentType = {
                ...indexContent,
                content: undefined,
                children: indexContent.id
            }


            const data = splitChildrenContent({
                caretPosition,
                contentData: indexContent,
                contentId,
                updatedParentId: indexContent.parentId,
                newParentId: newIndexContent.id,
            })





            if (data) {
                if (data.newChildren && data.newChildren.length > 0) {
                    if (data.newChildren.length === 1) {
                        const contentData = getContent({ id: data.newChildren[0].contentId });
                        newIndexContent.className = newIndexContent.className + contentData.className;
                        if (contentData.content) {
                            newIndexContent.content = contentData.content
                            newIndexContent.children = undefined
                        }
                        if (contentData.children) {
                            newIndexContent.children = contentData.children
                            newIndexContent.content = undefined
                        }
                        removeContent({ id: contentData.id });
                    }
                    upsetContent({ id: newIndexContent.id, value: newIndexContent })
                    if (newIndexContent.children) upsetChildren({ parentId: newIndexContent.children, value: data.newChildren })
                    else {
                        upsetChildren({ parentId: newIndexContent.id, value: [] })
                        removeChildren({ parentId: newIndexContent.id })
                    }
                    newChildren = [{
                        contentId: newIndexContent.id,
                        parentId: newIndexContent.parentId,
                    }, ...newChildren];

                }
                if (data.updatedChildren && data.updatedChildren.length > 0) {
                    if (data.updatedChildren.length === 1) {
                        const contentData = getContent({ id: data.updatedChildren[0].contentId });
                        updatedIndexContent.className = updatedIndexContent.className + contentData.className;
                        if (contentData.content) {
                            updatedIndexContent.content = contentData.content
                            updatedIndexContent.children = undefined
                        }
                        if (contentData.children) {
                            updatedIndexContent.children = contentData.children
                            updatedIndexContent.content = undefined
                        }

                        removeContent({ id: contentData.id });
                    }
                    upsetContent({ id: updatedIndexContent.id, value: updatedIndexContent })
                    if (updatedIndexContent.children) upsetChildren({ parentId: updatedIndexContent.children, value: data.updatedChildren })
                    else {
                        upsetChildren({ parentId: updatedIndexContent.id, value: [] })
                        removeChildren({ parentId: updatedIndexContent.id })
                    }
                    updatedChildren = [...updatedChildren, {
                        contentId: updatedIndexContent.id,
                        parentId: updatedIndexContent.parentId,
                    }];
                }
            }
        }
    }




    return { newChildren, updatedChildren }

}
