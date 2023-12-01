import { TrackHistoryListType } from '@/interface/trackHistory';

export let undoList: TrackHistoryListType[] = []

export const setupUndoList = (value: TrackHistoryListType[]) => {
    undoList = value;
}
