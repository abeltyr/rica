import { EditorRootType } from '@/interface/editor';

export let root: EditorRootType = []

export const setupRoot = (value: EditorRootType) => {
    root = value;
}