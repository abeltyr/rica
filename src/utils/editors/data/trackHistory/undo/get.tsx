import { undoList } from './data';
import { TrackHistoryListType } from '@/interface/trackHistory';


export const getUndoListAtIndex = (index: number): TrackHistoryListType | undefined => {

    const data = undoList[index];
    if (data)
        return JSON.parse(JSON.stringify(data))
}

export const getUndoList = (): TrackHistoryListType | undefined => {
    return JSON.parse(JSON.stringify(undoList))
}

export const getUndoListLength = (): number => {
    return undoList.length
}
