import { SelectorType } from '@/interface/editor';
import { getContent, getRootParentValue, validateId } from '@/utils/editors/data';
import { removalAction } from './removalAction';
import { finalPosition } from './finalPosition';
import { keyInputUpdate } from '../keyInput';
import { enterKey } from '../enterKey';
import { updateCaretToMatch } from '@/utils/actions';


export const selectionBasedAction = async ({
    event, selectedValues
}: {
    selectedValues: SelectorType[],
    event: React.KeyboardEvent<HTMLDivElement>
}
) => {


    let preventDefault = false;
    if (event.key === "Tab") {
        console.log("give the left side margin from the selected root")
        event.preventDefault();
        return
    }

    const firstContent = getContent({ id: selectedValues[0].id });
    const lastContent = getContent({ id: selectedValues[selectedValues.length - 1].id });

    const firstRootId = getRootParentValue({ contentValue: firstContent })

    // remove the selected data here
    await removalAction(selectedValues)


    let id = selectedValues[0].id
    let caretPosition = selectedValues[0].startPos;

    const data = finalPosition({
        event,
        firstRootId,
        lastContent,
        selectedValues
    })
    id = data.id;
    caretPosition = data.caretPosition;

    if (event.key.length === 1) {
        keyInputUpdate({
            id,
            key: event.key,
            currentPosition: caretPosition,
        })
        event.preventDefault();
        return
    }

    if (event.key === "Enter") {
        id = selectedValues[selectedValues.length - 1].id;
        caretPosition = selectedValues[selectedValues.length - 1].endPos - selectedValues[selectedValues.length - 1].selectedText.length;

        const lastContent = getContent({ id })
        if ((lastContent.children === undefined && lastContent.content === undefined)) {
            id = data.id;
            caretPosition = data.caretPosition;
        }

        enterKey({
            id,
            currentPosition: caretPosition
        })
        event.preventDefault();
        return
    }




    if (event.key === "Backspace") {
        console.log("basic action added with the backspace")
        preventDefault = true;
    }

    if (event.key === "Delete") {
        console.log("basic action added with the delete ")
        preventDefault = true;
    }

    if (preventDefault) event.preventDefault();

    updateCaretToMatch({ id, currentPosition: caretPosition })
}




