'use client'

import { useEditor } from '@/context/editor'
import { updateCaretToMatch } from '@/utils/actions';
import { stateCheck } from '@/utils/actions/stateCheck';
import { getContent, updateValueContent } from '@/utils/editors/data';
import { getCurrentlyEditedElement } from '@/utils/editors/node';
import React, { useEffect } from 'react'

const Editor = () => {

    const { editorValue, renderEditorDom, setEditorValue } = useEditor();
    useEffect(() => {
        renderEditorDom();
    })

    let id: string;
    let currentPosition: number;

    return (
        <div
            className={`w-full py-2 px-4 outline-none cursor-text block whitespace-pre-wrap break-words select-text border-2 rounded-xl`}
            id="Editor"
            contentEditable={true}
            onDragStart={(event: any) => {
                event.preventDefault();
            }}
            onInput={() => {
                // call the function getSelect to get the node and the current selection 

                // using the node fetch the id, current position

                /** 
                 * based on the current data loop through the node and fix any 
                 * new data that is added in the node and then the json
                */

                let { selection, node } = getCurrentlyEditedElement()

                console.log("onInput node", node)
                if (node && node.firstChild && selection) {
                    if (node.firstChild.nodeType === 3) {
                        updateValueContent({
                            id: id,
                            value: node.textContent
                        });
                    }
                    else {
                        stateCheck({ node })
                        // const parentContent = getContent({ id: node.id })
                        // if (!parentContent.parentId) {
                        //     ////TODO: May need a future check
                        // }
                    }
                    // add data match with the json
                }

            }}

            onKeyDown={async (event: React.KeyboardEvent<HTMLDivElement>) => {
                event.preventDefault();

                // call the function getSelect to get the node and the current selection 
                const { selection, node } = getCurrentlyEditedElement();

                // using the node fetch the id, current position

                let id = node.id;

                let currentPosition = selection!.focusOffset;

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

                    console.log("firstValueData", firstValueData)
                    console.log("secondValueData", secondValueData)
                    console.log("event.key", event.key)

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

            }}

            onKeyUp={(event) => {
                console.log(event.key)
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