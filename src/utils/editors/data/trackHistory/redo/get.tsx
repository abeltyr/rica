import { redoList } from './data';
import { TrackHistoryListType } from '@/interface/trackHistory';


export const getRedoListAtIndex = (index: number): TrackHistoryListType | undefined => {
    const data = redoList[index];
    if (data)
        return JSON.parse(JSON.stringify(data))
}

export const getRedoList = (): TrackHistoryListType | undefined => {
    return JSON.parse(JSON.stringify(redoList))
}

export const getRedoListLength = (): number => {
    return redoList.length
}
