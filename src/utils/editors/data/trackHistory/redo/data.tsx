import { TrackHistoryListType } from '@/interface/trackHistory';

export let redoList: TrackHistoryListType[] = []

export const setupRedoList = (value: TrackHistoryListType[]) => {
    redoList = value;
}
