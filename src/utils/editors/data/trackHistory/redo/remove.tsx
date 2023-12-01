import { redoList } from './data';

export const removeRedoList = (index: number,) => {
    redoList.splice(index, 1)
}

