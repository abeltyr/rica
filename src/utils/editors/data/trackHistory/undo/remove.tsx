import { undoList } from './data';

export const removeUndoList = (index: number,) => {
    undoList.splice(index, 1)
}

