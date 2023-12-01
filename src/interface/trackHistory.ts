import {
  EditorChildrenType,
  EditorStateContentType,
  ValueType,
} from "./editor";

export type TrackHistoryListType = {
  actionList: TrackHistoryType;
};

export type TrackHistoryType = {
  [id: string]: TrackHistory;
};
export type TrackHistory = {
  rootContent: EditorStateContentType;
  subsequentContents?: EditorStateContentType[];
  subsequentChildren?: EditorChildrenType[];
  parentChildren?: ValueType[];
  rootIndex: number;
  action: ActionType;
};

export type ActionType = "Remove" | "Render";
