import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getChildren, getContent, mergeContent, removeChildren, removeChildrenContent, removeContent, updateParentContent, upsetChildren, upsetContent } from '@/utils/editors/data';
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

    let caretPosition = 0
    let caretId = id
    if (beforeChildren.length > 0 && currentChildren.length > 0) {
        const currentChildFirstContent = getContent({ id: currentChildren[0].contentId })
        const beforeChildLastContent = getContent({ id: beforeChildren[beforeChildren.length - 1].contentId })


        if (
            currentChildFirstContent.type === beforeChildLastContent.type &&
            currentChildFirstContent.className === beforeChildLastContent.className &&
            JSON.stringify(currentChildFirstContent.additional) === JSON.stringify(beforeChildLastContent.additional)
        ) {

            if (beforeChildLastContent.children && currentChildFirstContent.children) {

                let beforeContentChildren = getChildren({ parentId: beforeChildLastContent.children });
                let currentContentChildren = getChildren({ parentId: currentChildFirstContent.children });
                let newChildrenData = [...beforeContentChildren, ...currentContentChildren];
                await newChildrenData.forEach((value, index) => {
                    newChildrenData[index].parentId = beforeChildLastContent.id;
                    updateParentContent({ id: value.contentId, parentId: beforeChildLastContent.id })
                })

                upsetChildren({ parentId: beforeChildLastContent.id, value: newChildrenData })
                upsetChildren({ parentId: currentChildFirstContent.id, value: [] })
                removeChildren({ parentId: currentChildFirstContent.id })
                removeContent({ id: currentChildFirstContent.id });
                currentChildren.splice(0, 1)

            } else {
                const data = mergeContent({ firstContent: beforeChildLastContent, secondContent: currentChildFirstContent })
                const mergedContent = data.mergedContent
                if (mergedContent) {
                    upsetContent({ id: mergedContent.id, value: mergedContent })
                    removeContent({ id: currentChildFirstContent.id });
                    currentChildren.splice(0, 1)
                    caretId = mergedContent.id;
                    caretPosition = (mergedContent.content ?? "").length - (currentChildFirstContent.content ?? "").length
                }
            }
        }
    }



    await currentChildren.forEach((value, index) => {
        newChildren = [...newChildren, {
            contentId: value.contentId,
            parentId: beforeContentId
        }];
        updateParentContent({ id: value.contentId, parentId: beforeContentId })
    })

    upsetChildren({ value: newChildren, parentId: beforeContentId })
    upsetChildren({ value: [], parentId: currentContentId })
    removeChildrenContent({ parentId: parentClass, contentId: currentContentId })

    const previousNode = document.getElementById(beforeContentId)
    const currentNode = document.getElementById(currentContentId)
    const content = getContent({ id: beforeContentId });
    const newChild = childIntegration({ editorStateData: content })
    if (previousNode) previousNode.replaceWith(newChild);
    if (currentNode) currentNode.remove();
    updateCaretToMatch({ id: caretId, currentPosition: caretPosition })
}