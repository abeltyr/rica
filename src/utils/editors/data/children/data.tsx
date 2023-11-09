import { EditorChildrenType } from '@/interface/editor';

export let children: EditorChildrenType = {}

export const setupChildren = (value: EditorChildrenType) => {
    children = value;
}