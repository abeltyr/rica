import { getContent, getContents, getRootParentValue, updateValueContent, validateId } from '@/utils/editors/data/content';
import { getAllChildren, getLastFirstChildId, } from '@/utils/editors/data/children';
import { backSpaceMovement } from './backSpaceMovement';
import { updateCaretToMatch } from '@/utils/actions';
import { fetchBeforeLastContent, parentRemoval } from './actions';


export const backSpaceKey = (
    {
        id,
        node,
        currentPosition,
    }: {
        id: string,
        node: Node,
        currentPosition: number,
    }) => {


    let contentId = validateId(id)
    let content = getContent({ id: contentId })
    let caretPosition = currentPosition;
    let currentNode = node;


    if (content) {

        if (currentPosition === 0) {
            let moveUp = false;
            const rootParentId = getRootParentValue({ contentValue: content });
            const rootContent = getContent({ id: rootParentId });
            const firstChildId = getLastFirstChildId(rootContent)
            if (firstChildId === contentId) moveUp = true

            if (moveUp) {
                console.info("MUP - moving up because it is at the root")
                backSpaceMovement(id)
                return
            } else {
                console.log("CUP - at the zero index but not at the root so just need to move the focus the node before the one we are at");
                const newContent = fetchBeforeLastContent(contentId);
                if (!newContent) {
                    console.error("newContent doesn't exist",)
                    return;
                }

                const newNode = document.getElementById(newContent.id)
                if (!newNode) {
                    console.error("newNode doesn't exist",)
                    return;
                }

                currentNode = newNode;
                content = newContent
                caretPosition = (content.content ?? "").length
                contentId = newContent.id

            }
        }





        /**
           * Here check if it backspace or delete and run the function to remove the value 
           * from the selected content type based on the position of the caret and the type 
           * of key pressed and update the json and the node accordingly
           * */


        const textValue = currentNode.textContent ?? "";

        if (textValue.length === 1) {
            console.log("LDE - last character need to adjust accordingly")
            if (currentNode instanceof Element) {
                parentRemoval(contentId)
            }

        } else {
            console.log("NTF - normal flow of deleting a character from the set")
            const position = Math.min(caretPosition - 1, textValue.length);
            let firstValueData = textValue.substring(0, caretPosition - 1);
            let secondValueData = textValue.substring(caretPosition);
            updateValueContent({ id: contentId, value: firstValueData + secondValueData })
            updateCaretToMatch({ id: contentId, currentPosition: position })

        }
    }
}

