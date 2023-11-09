import { EditorContentType } from '@/interface/editor';

export let contents: EditorContentType = {}

export const setupContents = (value: EditorContentType) => {
    contents = value;
}
