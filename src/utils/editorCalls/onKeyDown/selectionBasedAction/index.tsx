import { SelectorType } from '@/interface/editor';
import { getContent, getRootParentValue } from '@/utils/editors/data';
import { keyInputUpdate } from '../keyInput';
import { enterKey } from '../enterKey';
import { updateCaretToMatch } from '@/utils/actions';
import { positionSetter, removalAction } from './actions';


export const selectionBasedAction = async ({
    event, selectedValues
}: {
    selectedValues: SelectorType[],
    event: React.KeyboardEvent<HTMLDivElement>
}
) => {


    let preventDefault = false;

    /// ---------------- Edge Case  ---------------- ///
    if (event.key === "Tab") {
        console.log("give the left side margin from the selected root")
        event.preventDefault();
        return
    }

    /// ---------------- Edge Case End ---------------- ///


    const firstContent = getContent({ id: selectedValues[0].id });
    const lastContent = getContent({ id: selectedValues[selectedValues.length - 1].id });
    const firstRootId = getRootParentValue({ contentValue: firstContent })

    const positionData = positionSetter({
        event,
        firstContent,
        firstRootId,
        lastContent,
        selectedValues
    })

    // remove the selected data here
    await removalAction(selectedValues)


    let id = positionData.id;
    let caretPosition = positionData.caretPosition;


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

        enterKey({
            id,
            currentPosition: caretPosition
        })
        event.preventDefault();
        return
    }


    if (event.key === "Backspace" || event.key === "Delete") {
        preventDefault = true;
    }

    if (preventDefault) event.preventDefault();

    updateCaretToMatch({ id, currentPosition: caretPosition })
}




