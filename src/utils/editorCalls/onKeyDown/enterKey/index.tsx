import { EditorStateContentType, ValueType, } from '@/interface/editor';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { addChildren, getChildren, getLastFirstChildId, getRootParentIndex, insertChildren, updateChildrenValue, upsetChildren } from '@/utils/editors/data';
import { getContent, getRootParentValue, updateParentContent, updateValueContent, upsetContent, validateId } from '@/utils/editors/data/content';
import { childIntegration } from '@/utils/render';
import { v4 } from 'uuid';
import { splitChildrenContent, splitContent } from './utils';
import { childrenUpdate, contentUpdate, moveDown } from './actions';



export const enterKey = async (
    {
        id,
        currentPosition,
    }: {
        id: string,
        currentPosition: number,
    }) => {

    let contentId = validateId(id)
    let content = getContent({ id: contentId })
    let caretPosition = currentPosition;


    const rootId = getRootParentValue({ contentValue: content })
    const currentRootContent = getContent({ id: rootId })

    const parentChildren = getChildren({ parentId: parentClass })

    let rootIndex = getRootParentIndex(contentId)
    if (rootIndex === undefined || rootIndex < 0 || parentChildren.length < rootIndex) rootIndex = parentChildren.length;

    const rootNode = document.getElementById(parentClass);
    if (!rootNode) return


    if (currentPosition === 0) {
        let moveDownBool = false;
        const rootParentId = getRootParentValue({ contentValue: content });
        const rootContent = getContent({ id: rootParentId });
        const firstChildId = getLastFirstChildId(rootContent)
        if (firstChildId === contentId) moveDownBool = true
        console.log("at the root ")
        if (moveDownBool) {
            moveDown({
                currentRootContent,
                parentChildren,
                rootIndex,
                rootNode
            })
            return
        }
    }




    if (currentRootContent.content) {
        await contentUpdate({
            caretPosition,
            currentRootContent,
            parentChildren,
            rootIndex,
            rootNode
        })
        return;

    }

    if (currentRootContent.children) {
        await childrenUpdate({
            caretPosition,
            contentId,
            currentRootContent,
            parentChildren,
            rootId,
            rootIndex,
            rootNode
        })
        return;
    }


}


