
import { EditorStateContentType } from '@/interface/editor';
import { v4 } from 'uuid';
import { updateCaretToMatch } from './cursor';
import { spanChild } from '@/utils/render';

export const stateCheck = async (
    {
        node,
    }: {
        node: Node,
    }
) => {
    let parentId: string = "";
    if (node instanceof Element) {
        parentId = node.id;
    }


    /**
     * first create a variable to store the length of the node children's
     * then based on the it create two case one for when the length is equals to one
     * second for when the length is greater than one
     *  */


    /**
     * when the length is equals to one we check 
     * if that value is a text we add it as content value to the parent content
     * else if the child is an html 
     * if it is an html we fetch the content of it if it is has a content
     * we move the content to 
     * and check if the data is    
     */





    /**
     *  check 
     */


    /** Loop throw the give node children's and 
     * if the children is a text we need to convert it to content and in capsulate it
     * with in the html element
     */
    for (let i = 0; i < node.childNodes.length; i++) {

        if (node.childNodes[i].nodeType === 3) {

            /**
             * check if the text version of the child is found at the end or 
             * before another html or text component
             * if it is at the end create the content and add it to the last 
             *  */
            if (node.childNodes[i + 1]) {

                const initialData = node.childNodes[i].textContent ?? " ";
                node.childNodes[i + 1].textContent = initialData + node.childNodes[i + 1].textContent!;
                node.childNodes[i].remove();

                const childNode = node.childNodes[i];
                let id: string = "";
                if (childNode instanceof Element) {
                    const selection = window.getSelection();
                    id = childNode.id;
                    updateCaretToMatch({ id: id, currentPosition: initialData?.length, selection: selection! });
                }
                if (id.length > 0) {
                    // updateValueContent({
                    //     id: id!,
                    //     value: node.childNodes[i].textContent ?? "",
                    // })
                }
            } else {
                const id = v4();
                const initialData = node.childNodes[i].textContent ?? " ";

                const data: EditorStateContentType = {
                    id: id,
                    type: "P",
                    className: "",
                    direction: "",
                    indent: 0,
                    content: initialData
                }

                const childElement = spanChild(
                    {
                        editorStateData: data,
                    }
                )

                await node.childNodes[i].remove();
                await node.appendChild(childElement)
                const selection = window.getSelection();
                await updateCaretToMatch({ id: childElement.id, currentPosition: initialData?.length, selection: selection! });

                // addChildren({
                //     parentId: parentId,
                //     childId: id,
                //     value: {
                //         contentId: id,
                //         parentId: parentId,
                //     },
                // })
                // upsetContent({ id: id, value: data });
            }
        }
    }
}