import { EditorStateContentType, ValueType } from '@/interface/editor';
import { elementConvertor, updateCaretToMatch } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getAllChildren, getChildren, getContent, getContents, getRootParent, removeChildren, removeChildrenContent, removeChildrenData, removeContent, updateChildrenValue, updateContentChildren, updateParentContent, updateValueContent, upsetChildren, upsetContent, validateId } from '@/utils/editors/data';
import { childIntegration } from '@/utils/render';
import { v4 } from 'uuid';



const fetchLastChild = (value: EditorStateContentType): EditorStateContentType | undefined => {

    let id: EditorStateContentType | undefined;
    if (value.content != undefined) {
        id = value
    } else if (value.children) {
        const children = getChildren({ parentId: value.children });
        const content = getContent({ id: children[children.length - 1].contentId });
        id = fetchLastChild(content);
    }

    return id
}


export const remove = (
    {
        id,
        key,
        node,
        currentPosition,
        selection
    }:
        {
            id: string,
            key: string,
            node: Node,
            currentPosition: number,
            selection: Selection
        }
) => {

    const contentId = validateId(id)
    const textValue = node.textContent ?? "";


    if (key === "Backspace" && currentPosition === 0) {

        const rootIndex = getRootParent(contentId);
        console.log("firstAtRoot", rootIndex)

        console.log("getContents", getContents())
        console.log("getAllChildren", getAllChildren())

        if (rootIndex && rootIndex > 0) {
            let previousIndex = rootIndex - 1;
            const root = getChildren({ parentId: parentClass });


            const previousId = root[previousIndex].contentId
            const currentId = root[rootIndex].contentId

            const beforeContent = { ...getContent({ id: previousId }) };
            const currentContent = { ...getContent({ id: currentId }) };

            let newChildren: ValueType[] = [];


            if (beforeContent.children && currentContent.children) {
                let beforeChildren = [...getChildren({ parentId: previousId })];
                let currentChildren = [...getChildren({ parentId: currentId })];

                newChildren = [...beforeChildren, ...currentChildren]
                upsetChildren({ value: newChildren, parentId: beforeContent.id })
                upsetChildren({ value: [], parentId: currentContent.id })
                removeChildren({ parentId: currentContent.id })
                removeChildrenContent({ parentId: parentClass, contentId: currentContent.id })

                const previousNode = document.getElementById(beforeContent.id)
                const currentNode = document.getElementById(currentContent.id)
                const content = getContent({ id: beforeContent.id });
                const newChild = childIntegration({ editorStateData: content })
                if (previousNode) previousNode.replaceWith(newChild);
                if (currentNode) currentNode.remove();
                updateCaretToMatch({ id, currentPosition, selection: selection! })
            }
            else if (beforeContent.children && currentContent.content != undefined) {
                let beforeChildren = [...getChildren({ parentId: previousId })];
                if (currentContent.content) {
                    const previousNode = document.getElementById(beforeContent.id)
                    const currentNode = document.getElementById(currentContent.id)

                    // update the currentContent id
                    const newContent = {
                        ...currentContent,
                        id: v4(),
                        parentId: currentContent.id,
                    }
                    newContent.type = "P"


                    newChildren = [...beforeChildren, {
                        contentId: newContent.id,
                        parentId: beforeContent.id
                    }]

                    upsetChildren({ value: newChildren, parentId: beforeContent.id })
                    upsetContent({ id: newContent.id, value: newContent })
                    removeChildrenContent({ parentId: parentClass, contentId: currentId })

                    const content = getContent({ id: beforeContent.id });
                    const newChild = childIntegration({ editorStateData: content })
                    if (previousNode)
                        previousNode.replaceWith(newChild);
                    if (currentNode) currentNode.remove()

                    updateCaretToMatch({ id: newContent.id, currentPosition: 0, selection: selection! })
                }
                else if (currentContent.content === "") {
                    removeChildrenContent({ parentId: parentClass, contentId: currentContent.id })
                    const currentNode = document.getElementById(currentContent.id)
                    if (currentNode) currentNode.remove();
                    const lastContent = fetchLastChild(beforeContent)
                    if (lastContent)
                        updateCaretToMatch({ id: lastContent.id, currentPosition: -1, selection: selection! })
                }
            }
            else if (beforeContent.content != undefined && currentContent.children) {
                let currentChildren = [...getChildren({ parentId: currentId })];
                if (beforeContent.content) {

                    const previousNode = document.getElementById(beforeContent.id)
                    const currentNode = document.getElementById(currentId)

                    const newContent = {
                        ...beforeContent,
                        id: v4(),
                        parentId: beforeContent.id,
                    }
                    newContent.type = "P"

                    console.log("newContent", newContent)


                    newChildren = [
                        {
                            contentId: newContent.id,
                            parentId: beforeContent.id
                        }
                    ]

                    currentChildren.forEach((value, index) => {
                        newChildren =
                            [
                                ...newChildren,
                                {
                                    contentId: value.contentId,
                                    parentId: beforeContent.id
                                }
                            ]
                    })


                    upsetContent({ id: newContent.id, value: newContent })
                    updateParentContent({ id: currentId, parentId: beforeContent.id, })
                    upsetChildren({ value: newChildren, parentId: beforeContent.id })
                    updateContentChildren({ childrenId: beforeContent.id, id: beforeContent.id })
                    removeChildrenData({ parentId: parentClass, contentId: currentId })
                    upsetChildren({ parentId: currentId, value: [] })
                    removeChildren({ parentId: currentId })

                    const content = getContent({ id: beforeContent.id });

                    const newChild = childIntegration({ editorStateData: content })
                    if (previousNode)
                        previousNode.replaceWith(newChild);
                    if (currentNode) currentNode.remove()

                    updateCaretToMatch({ id: id, currentPosition: 0, selection: selection! })

                }
                else if (beforeContent.content === "") {
                    const currentNode = document.getElementById(beforeContent.id)
                    if (currentNode) currentNode.remove()
                    removeChildrenContent({ parentId: parentClass, contentId: beforeContent.id })
                }

            }

            else if (beforeContent.content != undefined && currentContent.content != undefined) {
                if (beforeContent.content && currentContent.content) {
                    const previousNode = document.getElementById(beforeContent.id)
                    const currentNode = document.getElementById(currentId)

                    const newBeforeContent = {
                        ...beforeContent,
                        id: v4(),
                        parentId: beforeContent.id,
                    }

                    const newContent = {
                        ...currentContent,
                        id: v4(),
                        parentId: beforeContent.id,
                    }

                    newBeforeContent.type = "P"
                    newContent.type = "P"


                    newChildren = [
                        {
                            contentId: newBeforeContent.id,
                            parentId: beforeContent.id
                        },
                        {
                            contentId: newContent.id,
                            parentId: beforeContent.id
                        }
                    ];


                    upsetContent({ id: newContent.id, value: newContent })
                    upsetContent({ id: newBeforeContent.id, value: newBeforeContent })

                    upsetChildren({ value: newChildren, parentId: beforeContent.id })

                    updateContentChildren({ childrenId: beforeContent.id, id: beforeContent.id })
                    removeChildrenData({ parentId: parentClass, contentId: currentId })

                    const content = getContent({ id: beforeContent.id });
                    const newChild = childIntegration({ editorStateData: content })
                    if (previousNode)
                        previousNode.replaceWith(newChild);
                    if (currentNode) currentNode.remove()

                    updateCaretToMatch({ id: newContent.id, currentPosition: 0, selection: selection! })


                }
                if (currentContent.content === "") {
                    const currentNode = document.getElementById(currentContent.id)
                    if (currentNode) currentNode.remove()
                    removeChildrenContent({ parentId: parentClass, contentId: currentContent.id })
                    updateCaretToMatch({ id: beforeContent.id, currentPosition: -1, selection: selection! })

                }
                if (beforeContent.content === "" && currentContent.content != "") {
                    const currentNode = document.getElementById(beforeContent.id)
                    if (currentNode) currentNode.remove()
                    removeChildrenContent({ parentId: parentClass, contentId: beforeContent.id })
                }
            }

            console.log("getContents", getContents())
            console.log("getAllChildren", getAllChildren())

        }
        return



    }


    if (key === "Delete" && currentPosition === textValue.length) {
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
        console.log("last")
        console.log("parent", node.parentElement)
    } else {
        console.log("rest")
        // let firstValueData = textValue.substring(0, currentPosition - 1);
        // let secondValueData = textValue.substring(currentPosition);
        // updateValueContent({ id, value: firstValueData + secondValueData })
        // updateCaretToMatch({ id, currentPosition: Math.min(currentPosition - 1, textValue.length), selection: selection! })
    }




    /**
     * setup the carter position based on the current one by keeping it or moving it back one left
     * by subtracting to it by one then call the update function using the id and the currentPosition
     * */

    /**
     * if the deleted value is the last of the content 
     */
}