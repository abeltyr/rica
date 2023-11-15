export type Editor = {
  id: string;
  editorState: EditorState;
  editorVersion: string;
  source: string;
  version: string;
  lastSaved: string;
};

export type ValueType = {
  contentId: string;
  parentId?: string;
};

export type EditorState = {
  children: EditorChildrenType;
  content: EditorContentType;
  rule: EditorStateRule;
};

export type EditorChildrenType = {
  [parentId: string]: ValueType[];
};

export type EditorContentType = {
  [id: string]: EditorStateContentType;
};

export type EditorStateContentType = {
  id: string;
  type: EditorType;
  format?: TextAlignment;
  mode?: string;
  className: string | "";
  children?: string;
  content?: string;
  indent: number | 0;
  direction: string;
  disabled?: boolean;
  additional?: EditorAdditionDataType;
  parentId?: string;
};

export type EditorStateRule = {
  maxChildrenAmount: number | null;
  availableFeature: string[];
};
export type EditorAdditionDataType = {
  link?: EditorLinkAttrs;
  assets?: EditorAssetsAttrs;
  ytVideo?: EditorYoutubeVideoAttrs;
};

export type EditorLinkAttrs = {
  href: string;
  ref?: string;
  title?: string;
  target?: string;
  extra?: string[];
};

export type EditorAssetsAttrs = {
  source: string;
  sourceType: string;
  alt: string;
  caption: string;
  showCaption: boolean;
  constrain: AssetsConstrain;
  assetFormat: string;
  extra: string[];
};

export type EditorYoutubeVideoAttrs = {
  videoId: string;
  extra: string[];
};

export type EditorType =
  | "P"
  | "H1"
  | "H2"
  | "H3"
  | "InlineLink"
  | "Link"
  | "Quote"
  | "Bullet"
  | "ListItem"
  | "Code"
  | "Image"
  | "Video"
  | "Audio"
  | "YTVideo";

export type TextAlignment = "Start" | "Center" | "End" | "Justify" | null;

export type AssetsConstrain = {
  width: string | number;
  height: string | number;
  maxHeight?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  minWidth?: string | number;
};

export type SelectorType = {
  id: string;
  node: HTMLElement;
  fullySelected: boolean;
  selectedText: string;
  wholeText: string;
  startPos: number;
  endPos: number;
};
