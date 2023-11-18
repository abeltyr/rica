import { EditorStateContentType, } from '@/interface/editor';
import { fetchLastChild, getAllChildren, getChildren, getChildrenIndex, getContent, getContents, getRootParentValue, removeChildrenContent, updateValueContent, validateId } from '@/utils/editors/data';
import { backSpaceMovement } from './backSpaceMovement';
import { updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';


const getLastFirstChildId = (value: EditorStateContentType): string => {

    let id;
    if (value.children) {
        const children = getChildren({ parentId: value.children })
        if (children.length > 0) {
            const content = getContent({ id: children[0].contentId })
            id = getLastFirstChildId(content);
        } else {
            id = value.id
        }
    } else {
        id = value.id
    }

    return id
}

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
            let pass = false;
            const rootParentId = getRootParentValue({ contentValue: content });
            const rootContent = getContent({ id: rootParentId });
            const firstChildId = getLastFirstChildId(rootContent)
            if (firstChildId === contentId) pass = true

            console.log("pass", firstChildId === contentId, firstChildId, contentId)
            if (pass) {
                console.log("here the caret is on the zero of the zero index so the root need to move up")
                backSpaceMovement(id)
                return
            } else {
                console.log("here the caret is a zero but not at the zero zero index, so we just need to move the node focus to be on the one before the ")

                console.log("contentId", contentId);
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
            console.log("content", content, caretPosition, currentNode)

        }

        const textValue = currentNode.textContent ?? "";
        /**
           * Here check if it backspace or delete and run the function to remove the value 
           * from the selected content type based on the position of the caret and the type 
           * of key pressed and update the json and the node accordingly
           * */



        if (textValue.length === 1) {
            console.log("last text so remove all")
            if (currentNode instanceof Element) {
                parentRemoval(currentNode)
            }

        } else {
            const position = Math.min(caretPosition - 1, textValue.length);
            let firstValueData = textValue.substring(0, caretPosition - 1);
            let secondValueData = textValue.substring(caretPosition);
            updateValueContent({ id: contentId, value: firstValueData + secondValueData })
            updateCaretToMatch({ id: contentId, currentPosition: position })
            console.log("position", position, id)

        }

        console.log(getContents());
        console.log(getAllChildren());
    }
}



const parentRemoval = (node: Element) => {
    const parent = node.parentElement;
    const contentId = node.id;
    if (parent) {
        const parentId = parent.id;

        if (parentId === parentClass) {
            console.log(" this is the parent class children")
            return
        }

        const index = getChildrenIndex({ contentId: contentId, parentId })

        const parentContent = getContent({ id: parentId })
        if (!parentContent.children) return

        const parentChildren = getChildren({ parentId: parentContent.children })

        console.log("index", index, node, node.parentElement);
        if (index > 0) {
            console.log("this mean it is not the only child of the parent list and it is also not at the zero index")
            const beforeNode = parentChildren[index - 1]
            const beforeId = beforeNode.contentId;

            const beforeContent = getContent({ id: beforeId });
            const lastContent = fetchLastChild(beforeContent);
            if (lastContent)
                updateCaretToMatch({ id: lastContent.id, currentPosition: -1 })
            removeChildrenContent({ contentId, parentId })
            node.remove();

            console.log("delete the current index and move to the next");
        } else {
            console.log("parent", parentChildren, parent);
            if (parentChildren.length > 1) {
                moveBack(parentId)
                removeChildrenContent({ contentId, parentId })
                node.remove();
            } else {
                console.log("this mean it is at the zero index and last child of the parent, while the parent is not the main parent")
                parentRemoval(parent);
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

                console.log("index-index", index)
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