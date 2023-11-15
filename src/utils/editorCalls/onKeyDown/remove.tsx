import { EditorStateContentType, ValueType } from '@/interface/editor';
import { elementConvertor } from '@/utils/actions';
import { parentClass } from '@/utils/commons';
import { getAllChildren, getChildren, getContent, getContents, getRootParent, updateContentChildren, updateValueContent, upsetChildren, upsetContent, validateId } from '@/utils/editors/data';
import { v4 } from 'uuid';



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



    //TODO: need to figure out which come first this or the above                    
    if (key === "Backspace" && currentPosition === 0) {

        // const content = getContent({ id })
        // let childIndex;

        const rootIndex = getRootParent(contentId);
        console.log("firstAtRoot", rootIndex)
        if (rootIndex && rootIndex > 0) {
            let previousIndex = rootIndex - 1;
            const root = getChildren({ parentId: parentClass });

            console.log("root", root,)
            console.log("previousIndex", root[previousIndex].contentId,)

            const previousId = root[previousIndex].contentId
            const currentId = root[rootIndex].contentId

            console.log("previousId", previousId,)
            console.log("currentId", currentId)

            const previousContent = getContent({ id: previousId });
            const currentContent = getContent({ id: currentId });

            console.log("previousContent", previousContent)
            console.log("currentContent", currentContent)

            const previousChildren = getChildren({ parentId: previousId });
            const currentChildren = getChildren({ parentId: currentId });

            console.log("previousChildren", previousChildren, previousIndex, rootIndex)
            console.log("currentChildren", currentChildren)
            let newChildren: ValueType[] = [];


            if (previousContent.children) {
                if (currentContent.children) {
                    newChildren = [...previousChildren, ...currentChildren]
                    const previousNode = document.getElementById(previousContent.id)
                    const currentNode = document.getElementById(currentContent.id)
                    if (currentNode && previousNode)
                        previousNode.append(currentNode)

                    upsetChildren({ value: newChildren, parentId: previousContent.id })

                } else if (currentContent.content) {

                }


            }
            else if (previousContent.content != undefined) {
                if (currentContent.children) {
                    const previousNode = document.getElementById(previousContent.id)

                    const id = v4();
                    let currentContentData: EditorStateContentType | undefined | null;

                    if (previousNode instanceof Element) {
                        if (previousNode.firstChild instanceof Element) {
                            currentContentData = elementConvertor(previousNode.firstChild);
                        }
                    }
                    if (currentContentData && currentContentData.content) {
                        currentContentData.id = id;
                        newChildren = [
                            {
                                contentId: currentContentData.id,
                            },
                            ...currentChildren
                        ]
                        upsetContent({ id: currentContentData?.id, value: currentContentData })
                    } else {
                        newChildren = [
                            ...currentChildren
                        ]

                    }

                    upsetChildren({ value: newChildren, parentId: previousContent.id })
                    updateContentChildren({ childrenId: previousContent.id, id: previousContent.id })


                    // const currentNode = document.getElementById(currentContent.id)
                    // // if (currentNode && previousNode)
                    // //     previousNode.append(currentNode)



                    console.log("newChildren", newChildren,)
                    console.log("getContent", getContents(),)
                    console.log("getAllChildren", getAllChildren(),)




                } else if (currentContent.content) {


                }

            }

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