export const updateCaretToMatch = ({ id, currentPosition }: { id: string, currentPosition: number }) => {

    const selection = window.getSelection();
    if (selection !== null) {

        const contentEditableElement = document.getElementById(id);

        if (contentEditableElement) {
            let node = contentEditableElement;
            /**
             * if the selected node is a parent placing the caret inside of it would not work unless they are text based node
             * so for those case that are html as well we select the first child of the parent to update to the node.
             * this is done to give a better caret movement even if there is a id shift issue.
             */
            if (contentEditableElement.firstChild?.nodeType === 1) {
                const firstChild = contentEditableElement.children[0];
                if (firstChild instanceof HTMLElement) {
                    node = firstChild;
                }
            }

            const range = selection!.getRangeAt(0);
            if (range) {
                /** 
                 * if the child of the current node is a text we check if the given current position  
                 * is greater than the length of the text content update the position to be the same 
                 * as the text content full length
                 * 
                 */
                if (node!.firstChild && node!.firstChild!.nodeType === 3) {
                    let currentLength = node!.firstChild.textContent?.length ?? 0;
                    let movePosition = currentPosition
                    if (movePosition < 0 || (currentLength && movePosition > currentLength)) movePosition = currentLength;

                    range.setStart(node!.firstChild!, movePosition)
                }
                /**
                 * else if the child is still an html component we just set the position to zero so 
                 * that the caret go tht the first child 
                 */
                else
                    range.setStart(node!, 0)


                range.collapse(true);
                selection!.removeAllRanges();


                selection!.addRange(range);
            }


            // node!.focus();

            node!.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
    }
}