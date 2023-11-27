import { EditorChildrenType, EditorStateContentType, ValueType } from '@/interface/editor';
import { parentClass } from '@/utils/commons';
import { getContent, children } from '@/utils/editors/data';

export const getChildren = ({ parentId }: { parentId: string }): ValueType[] => {
    const data = children[parentId];
    if (data) {
        const value: ValueType[] = JSON.parse(JSON.stringify(data));
        return value;
    }
    else {
        return []
    }
}

export const getAllChildren = (): EditorChildrenType => {
    const value: EditorChildrenType = JSON.parse(JSON.stringify(children));
    return value;
}

export const getChildrenIndex = ({ parentId, contentId }: { parentId: string, contentId: string }) => {
    if (children[parentId]) {
        return children[parentId].findIndex(value => value.contentId === contentId);
    }
    else {
        return -1;
    }
}


export const getRootParentIndex = (id: string): number | undefined => {
    let rootParentIndex: number | undefined;
    const content = getContent({ id })

    if (content) {
        let parentId = content.parentId;

        if (parentId) {
            rootParentIndex = getRootParentIndex(parentId)
        } else {
            parentId = parentClass;
            rootParentIndex = getChildrenIndex({ contentId: id, parentId: parentClass });
        }
    } else {
        console.error(" content with id ", id, " doesn't exist")
    }
    return rootParentIndex
}


export const fetchLastChild = (value: EditorStateContentType): EditorStateContentType | undefined => {
    let contentValue: EditorStateContentType | undefined;
    if (value.content != undefined) {
        contentValue = value
    } else if (value.children) {
        const children = getChildren({ parentId: value.children });
        if (children.length > 0) {
            const content = getContent({ id: children[children.length - 1].contentId });
            contentValue = fetchLastChild(content);
        }
    }

    return contentValue
}


export const fetchFirstChild = (value: EditorStateContentType): EditorStateContentType | undefined => {
    let contentValue: EditorStateContentType | undefined;
    if (value.content != undefined) {
        contentValue = value
    } else if (value.children) {
        const children = getChildren({ parentId: value.children });
        const content = getContent({ id: children[0].contentId });
        contentValue = fetchFirstChild(content);
    }

    return contentValue
}


export const getLastChild = (value: EditorStateContentType): string => {

    let id;
    if (value.children) {
        const children = getChildren({ parentId: value.children })
        if (children.length > 0) {
            const content = getContent({ id: children[children.length - 1].contentId })
            id = getLastChild(content);
        } else {
            id = value.id
        }
    } else {
        id = value.id
    }

    return id
}


export const getFirstChildId = (value: EditorStateContentType): string => {

    let id;
    if (value.children) {
        const children = getChildren({ parentId: value.children })
        if (children.length > 0) {
            const content = getContent({ id: children[0].contentId })
            id = getFirstChildId(content);
        } else {
            id = value.id
        }
    } else {
        id = value.id
    }

    return id
}
