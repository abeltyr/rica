import { updateCaretToMatch } from '@/utils/actions';
import { updateValueContent } from '@/utils/editors/data';

export const keyInputUpdate = (
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

    const textValue = node.textContent ?? "";
    /**
     * Here goes the function to add the added key value to the appropriate json
     * and update the node accordingly
     * */
    let firstValueData = textValue.slice(0, currentPosition);
    let secondValueData = textValue.slice(currentPosition, textValue.length);
    updateValueContent({ id, value: firstValueData + key + secondValueData })
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