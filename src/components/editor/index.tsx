'use client'

import { useEditor } from '@/context/editor'
import { caretIndexFinder, elementConvertor, updateCaretToMatch } from '@/utils/actions';
import { stateAdjuster } from '@/utils/actions';
import { htmlConvertor } from '@/utils/actions/htmlConvertor';
import { parentClass } from '@/utils/commons';
import { getAllChildren, getChildren, getContents, updateValueContent, upsetContent } from '@/utils/editors/data';
import { getCurrentlyEditedElement } from '@/utils/editors/node';
import React, { useEffect } from 'react'

const Editor = () => {
    const { renderEditorDom } = useEditor();
    useEffect(() => {
        renderEditorDom();
    })

    let id: string;
    let currentPosition: number;

    return (
        <div
            className={`w-full py-2 px-4 outline-none cursor-text block whitespace-pre-wrap break-words select-text border-2 rounded-xl`}
            id={parentClass}
            contentEditable={true}
            onDragStart={(event: any) => {
                event.preventDefault();
            }}
            onInput={async () => {
                // call the function getSelect to get the node and the current selection 
                let editorData = getCurrentlyEditedElement();
                let node = editorData.node;
                let selection = editorData.selection;

                if (node && selection) {
                    // using the node fetch the id, current position
                    id = node.id;
                    currentPosition = selection!.focusOffset;
                    console.log("onInput node", node, id, currentPosition, node.children)

                    if (node.children.length > 0) {
                        console.info("html need cleaning up",)
                        const index = caretIndexFinder({ node });
                        await stateAdjuster({ node })
                        await htmlConvertor({ node })
                        if (index > 0) {
                            let editorData = node.children[index];
                            node = editorData;
                            id = editorData.id;
                        }
                    } else if (node.children.length === 1 && node.firstChild.nodeType === 3) {
                        updateValueContent({
                            id: id,
                            value: node.textContent
                        });
                        console.info("html just updated",)
                    }
                }

                console.log("contents", getContents())
                console.log("children", getAllChildren())
                console.log("children", getChildren({ parentId: parentClass }))
            }}

            onKeyDown={async (event: React.KeyboardEvent<HTMLDivElement>) => {
                console.log("on keyDown", event.key, event.code)

                let skipPrevention = true;
                if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    return
                }

                // call the function getSelect to get the node and the current selection 
                let editorData = getCurrentlyEditedElement();

                let node = editorData.node;
                let selection = editorData.selection;
                id = node.id;
                currentPosition = selection!.focusOffset;
                // using the node fetch the id, current position

                console.log("children", node.children, currentPosition, id)

                if (node.children.length > 0) {
                    const index = caretIndexFinder({ node });
                    console.info("html need cleaning up",)
                    await stateAdjuster({ node })
                    await htmlConvertor({ node })
                    if (index > 0) {
                        let editorData = node.children[index];
                        node = editorData;
                        id = editorData.id;
                    }
                }

                /**
                 * call the getTextSelection to fetch the selected text in a form of an array
                 */

                // setup an if to check when there is text selection here

                /**
                 * if the selection has value
                 */


                if (event.key.length === 1) {

                    /**
                     * Here goes the function to add the added key value to the appropriate json
                     * and update the node accordingly
                     * */
                    let firstValueData = node.textContent.slice(0, currentPosition);
                    let secondValueData = node.textContent.slice(currentPosition, node.textContent.length);
                    updateValueContent({ id, value: firstValueData + event.key + secondValueData })
                    currentPosition++;


                    /**
                     * setup the carter position based on the current one by adding one to it 
                     * then call the update function using the id and the currentPosition
                     * */
                    updateCaretToMatch({
                        id,
                        currentPosition,
                        selection: selection!
                    })
                }


                if (event.key === "Backspace" || event.key === "Delete") {

                    /**
                     * Here check if it backspace or delete and run the function to remove the value 
                     * from the selected content type based on the position of the caret and the type 
                     * of key pressed and update the json and the node accordingly
                     * */


                    if (node.textContent.length === 1) {
                        console.log("last")
                        console.log("parent", node.parentElement)
                    } else {
                        let firstValueData = node.textContent.substring(0, currentPosition - 1);
                        let secondValueData = node.textContent.substring(currentPosition);
                        updateValueContent({ id, value: firstValueData + secondValueData })
                        updateCaretToMatch({ id, currentPosition: Math.min(currentPosition - 1, node.textContent.length), selection: selection! })
                    }


                    //TODO: need to figure out which come first this or the above                    
                    if (event.key === "Backspace" || currentPosition === 0) {
                        console.log("on the first")

                        // if the id is at the first of the root the root will need to remove the current one and move it to the root above it
                        // need it check if the root is at the first of the root list


                        // if the id is at the first of the content inside a child the children will need to remove the current content and move it to the content before it
                        // need it check if the content is at the first of the children list
                    }


                    if (event.key === "Delete" || currentPosition === node.textContent.length) {
                        console.log("on the last")

                        // if the id is at the last of the root the root will need to remove the current one and move it to the root above it
                        // need it check if the root is at the last of the root list


                        // if the id is at the last of the content inside a child the children will need to remove the current content and move it to the content before it
                        // need it check if the content is at the last of the children list
                    }



                    /**
                     * setup the carter position based on the current one by keeping it or moving it back one left
                     * by subtracting to it by one then call the update function using the id and the currentPosition
                     * */

                    /**
                     * if the deleted value is the last of the content 
                     */
                }



                if (event.key === "Tap") {
                    /**
                     * check the previous clicked value move the content by one margin 
                     * in any direction by updating the indent value and adding a margin value 
                     * to the node
                     * */
                }


                if (event.key === "Enter") {
                    /**
                     * run the function to cut the text or children and move it to the next
                     * root
                     * */


                    /**
                     * setup the carter position to the first then call the 
                     * update function using the id and the currentPosition for the new root
                     * */
                }

                // shortcuts
                if (event.key === "Shift") {
                    /**
                     * save the key Shift has been clicked and is being for the shortcut
                     * */
                }
                if (event.key === "Meta") {
                    /**
                     * save the key Meta has been clicked and is being for the shortcut
                     * */
                }
                if (event.key === "Control") {
                    /**
                     * save the key Control has been clicked and is being for the shortcut
                     * */
                }
                if (event.key === "Alt") {
                    /**
                     * save the key Alt has been clicked and is being for the shortcut
                     * */
                }

                if (skipPrevention)
                    event.preventDefault();

            }}

            onKeyUp={(event) => {
                // console.log("on keyUp", event.key, event.code)
                if (event.key === "Shift") {
                    /**
                     * save the key Shift has been released and is being for the shortcut
                     * */
                }
                if (event.key === "Meta") {
                    /**
                     * save the key Meta has been released and is being for the shortcut
                     * */
                }
                if (event.key === "Control") {
                    /**
                     * save the key Control has been released and is being for the shortcut
                     * */
                }
                if (event.key === "Alt") {
                    /**
                     * save the key Alt has been released and is being for the shortcut
                     * */
                }
            }}



            onPaste={(event) => {

                event.preventDefault();
                const clipboardData = event.clipboardData;
                const pastedText = clipboardData.getData('text');

                // Now you can do something with the pasted text
                console.log("pastedText", pastedText);
                const lines = pastedText.split(/\r?\n/);

                console.log("lines", lines);

            }}


            onCopy={(event) => {

                event.preventDefault();
                const clipboardData = event;
                // const pastedText = clipboardData.getData('text');

                // Now you can do something with the pasted text
                // console.log("pastedText", clipboardData);
                // const lines = pastedText.split(/\r?\n/);

                // console.log("lines", lines);

            }}
        >
        </div>
    )
}

export default Editor



{/* sadda
            <p id="20" key="20" className="leading-7 outline-none cursor-text text-start ">
                <span id="30" key="30">Welcome </span> sadda das hajs adssajk
                <a id="40" key="40" className="underline text-blue-300 italic " href="https://google.com" target="_blank">
                    <span id="50" key="50" className="font-bold text-red-300 italic no-underline"> To </span>
                    <span id="60" key="60">Link </span>
                </a>
                saads asd
                <span id="70" key="70"> Pp Data </span>
                jknkj k
                <a id="80" key="80" className="underline text-blue-300 italic " href="https://google.com" target="_blank">
                    <span id="90" key="90" className="font-bold italic"> To </span>
                    <span id="100" key="100">Link</span>
                </a>
            </p> */}