import { EditorStateContentType, } from '@/interface/editor';
import { getContent, getContents, getRootParentValue, updateValueContent, validateId } from '@/utils/editors/data/content';
import { fetchLastChild, getAllChildren, getChildren, getChildrenIndex, getLastFirstChildId, removeChildren, removeChildrenContent } from '@/utils/editors/data/children';
import { backSpaceMovement } from './backSpaceMovement';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';


export const backSpaceKey = (
    {
        id,
        node,
        currentPosition,
    }:
        {
            id: string,
            node: Node,
            currentPosition: number,
        }
) => {


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
            const position = Math.min(caretPosition - 1, textValue.length);
            let firstValueData = textValue.substring(0, caretPosition - 1);
            let secondValueData = textValue.substring(caretPosition);
            console.log("NTF - normal flow of deleting a character from the set")
            updateValueContent({ id: contentId, value: firstValueData + secondValueData })
            updateCaretToMatch({ id: contentId, currentPosition: position })

        }

        // console.log(getContents());
        // console.log(getAllChildren());
    }
}



const parentRemoval = (id: string) => {
    const contentId = validateId(id);
    const node = document.getElementById(contentId);

    if (!node) return;
    const parent = node.parentElement;

    if (parent) {
        const parentId = parent.id;

        if (parentId === parentClass) {
            // console.log(" this is the parent class children", node, node.parentElement)

            // const content = getContent({ id: contentId })
            // console.log(content);
            // content.content = "";
            // // const spanChildElement = spanChild({ editorStateData: content, parentNodeExist: true });
            // // node.firstChild?.replaceWith(spanChildElement);


            // removeChildren()
            const content = getContent({ id: contentId })
            if (content.children) {
                // console.log("remove his children", content.children)
                removeChildren({ parentId: content.children })
            }


            // console.log("rebuild the content")
            updateValueContent({ id: contentId, value: "" })

            return
        }

        const index = getChildrenIndex({ contentId: contentId, parentId })

        const parentContent = getContent({ id: parentId })
        if (!parentContent.children) return

        const parentChildren = getChildren({ parentId: parentContent.children })

        // console.log("index", index, node, node.parentElement);
        if (index > 0) {
            // console.log("this mean it is not the only child of the parent list and it is also not at the zero index")
            const beforeNode = parentChildren[index - 1]
            const beforeId = beforeNode.contentId;

            const beforeContent = getContent({ id: beforeId });
            const lastContent = fetchLastChild(beforeContent);
            if (lastContent)
                updateCaretToMatch({ id: lastContent.id, currentPosition: -1 })
            removeChildrenContent({ contentId, parentId })
            node.remove();

            // console.log("delete the current index and move to the next");
        } else {
            // console.log("parent", parentChildren, parent);
            if (parentChildren.length > 1) {
                moveBack(parentId)
                removeChildrenContent({ contentId, parentId })
                node.remove();
            } else {
                // console.log("this mean it is at the zero index and last child of the parent, while the parent is not the main parent")
                parentRemoval(parent.id);
            }
        }
    }

}


const moveBack = (id: string) => {
    const content = getContent({ id });
    if (content.parentId) {
        const parent = getContent({ id: content.parentId });
        if (!parent.children) return
        const parentChildren = getChildren({ parentId: parent.children });
        if (parent) {
            const parentId = parent.id
            if (parentId != parentClass) {
                const index = getChildrenIndex({ contentId: id, parentId: parentId })
                if (index > 0) {
                    const beforeNode = parentChildren[index - 1]
                    if (!beforeNode) return;

                    const beforeId = beforeNode.contentId;
                    const beforeContent = getContent({ id: beforeId });
                    const lastContent = fetchLastChild(beforeContent);
                    if (lastContent) updateCaretToMatch({ id: lastContent.id, currentPosition: -1 })
                } else if (parent.parentId) {
                    moveBack(parent.parentId)
                }
            }
        }
    }

}

const fetchBeforeLastContent = (id: string): EditorStateContentType | undefined => {
    let finalContent: EditorStateContentType | undefined;

    const currentContent = getContent({ id });

    if (!currentContent.parentId) return;

    if (currentContent.parentId === parentClass) return

    const parentContent = getContent({ id: currentContent.parentId });
    if (!parentContent.children) return;

    const parentChildren = getChildren({ parentId: parentContent.children })
    const index = getChildrenIndex({ contentId: currentContent.id, parentId: parentContent.id })

    if (index > 0) {
        const previousContentID = parentChildren[index - 1].contentId
        const newContent = getContent({ id: previousContentID });
        if (newContent.content) {
            finalContent = newContent;
        }
        else if (newContent.children) {
            const content = fetchLastChild(newContent)
            if (content) finalContent = content
        }
    } else {
        const content = fetchBeforeLastContent(parentContent.id)
        if (content) finalContent = content
    }
    return finalContent;
}