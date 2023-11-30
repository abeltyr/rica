import { EditorStateContentType, ValueType } from '@/interface/editor';
import { getChildren, getContent, getLastChildId, updateParentContent, upsetChildren } from '..';


export const mergeContent = ({
    firstContent,
    secondContent
}: {
    firstContent: EditorStateContentType,
    secondContent: EditorStateContentType,
}) => {

    let mergedContent: EditorStateContentType | undefined;


    if (
        firstContent.content &&
        secondContent.content &&
        checkContentCompatibly(firstContent, secondContent)
    ) {
        mergedContent = {
            ...firstContent,
            content: firstContent.content + secondContent.content
        }
    }
    if (firstContent.children && secondContent.content) {

        const firstChildren = getChildren({ parentId: firstContent.children });
        if (firstChildren.length > 0) {
            const lastChildContent = getContent({ id: firstChildren[firstChildren.length - 1].contentId })

            if (checkContentCompatibly(lastChildContent, secondContent)) {
                mergedContent = {
                    ...lastChildContent,
                    content: lastChildContent.content + secondContent.content
                }
            }
        }

    }
    if (firstContent.content && secondContent.children) {
        const secondChildren = getChildren({ parentId: secondContent.children });
        if (secondChildren.length > 0) {
            const firstChildContent = getContent({ id: secondChildren[0].contentId })
            if (checkContentCompatibly(firstChildContent, firstContent)) {
                mergedContent = {
                    ...firstChildContent,
                    content: firstContent.content + firstChildContent.content
                }
            }
        }

    }


    return { mergedContent };
}


const checkContentCompatibly = (
    firstContent: EditorStateContentType,
    secondContent: EditorStateContentType,) => {
    return (firstContent.type === secondContent.type &&
        firstContent.className === secondContent.className &&
        JSON.stringify(firstContent.additional) === JSON.stringify(secondContent.additional))

}