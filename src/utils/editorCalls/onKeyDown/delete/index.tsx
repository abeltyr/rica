import { EditorStateContentType, } from '@/interface/editor';
import { fetchLastChild, getChildren, getChildrenIndex, getContent, getRootParentValue, removeChildrenContent, updateValueContent, validateId } from '@/utils/editors/data';
import { backSpaceMovement } from './deleteMovement';
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

export const deleteKey = (
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


    const contentId = validateId(id)
    const content = getContent({ id: contentId })
    if (content) {


        const textValue = node.textContent ?? "";

        if (currentPosition === textValue.length) {
            console.log("on the last")

            // if the id is at the last of the root the root will need to remove the current one and move it to the root above it
            // need it check if the root is at the last of the root list


            // if the id is at the last of the content inside a child the children will need to remove the current content and move it to the content before it
            // need it check if the content is at the last of the children list
        }





        /**
           * Here check if it backspace or delete and run the function to remove the value 
           * from the selected content type based on the position of the caret and the type 
           * of key pressed and update the json and the node accordingly
           * */



        if (textValue.length === 1) {
            console.log("last text so remove all")
            console.log("parent", node.parentElement)
            // if (node instanceof Element) {
            //     parentRemoval(node)
            // }

        } else {





            // let firstValueData = textValue.substring(0, currentPosition - 1);
            // let secondValueData = textValue.substring(currentPosition);
            // updateValueContent({ id, value: firstValueData + secondValueData })
            const position = Math.min(currentPosition - 1, textValue.length);

            console.log("position", position, id)

            if (position === 0) {
                console.log("currentPosition will be moved to the zero index so need to adjust properly ")

                // if (node instanceof Element)
                //     moveBack(node);
            }
            else
                console.log("update the normalflow")

        }

    }
}



const parentRemoval = (node: Element) => {
    const parent = node.parentElement;
    const contentId = node.id;
    if (parent) {
        const parentId = parent.id;

        const index = getChildrenIndex({ contentId: contentId, parentId })
        console.log("index", index);
        if (index > 0) {
            const beforeNode = parent.children[index - 1]
            const beforeId = beforeNode.id;

            const beforeContent = getContent({ id: beforeId });
            const lastContent = fetchLastChild(beforeContent);
            if (lastContent)
                updateCaretToMatch({ id: lastContent.id, currentPosition: -1 })
            console.log("delete the current index and move to the next");
            removeChildrenContent({ contentId, parentId })
            node.remove();
        } else {
            if (parent.children.length > 1) {
                console.log("just at index 0")
                moveBack(parent);
                removeChildrenContent({ contentId, parentId })
                node.remove();

            } else {
                if (parentId != parentClass) {
                    parentRemoval(parent);
                    console.log("in here")
                }
                else {
                    const root = document.getElementById(parentClass);
                    console.log("root", root);
                    root
                }

            }
        }
    }

}


const moveBack = (element: Element) => {
    const parent = element.parentElement;
    const currentElementId = element.id;
    if (parent) {
        const parentId = parent.id
        if (parentId != parentClass) {
            const index = getChildrenIndex({ contentId: currentElementId, parentId: parentId })

            console.log("index-index", index)
            if (index > 0) {
                const beforeNode = parent.children[index - 1]
                const beforeId = beforeNode.id;

                const beforeContent = getContent({ id: beforeId });
                const lastContent = fetchLastChild(beforeContent);
                if (lastContent) updateCaretToMatch({ id: lastContent.id, currentPosition: -1 })
            } else {
                moveBack(parent)

            }

        }
    }

}