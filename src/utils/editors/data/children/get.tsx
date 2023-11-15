import { parentClass } from '@/utils/commons';
import { getContent, children } from '@/utils/editors/data';

export const getChildren = ({ parentId }: { parentId: string, }) => {
    return children[parentId];
}

export const getAllChildren = () => {
    return children;
}

export const getChildrenIndex = ({ parentId, contentId }: { parentId: string, contentId: string }) => {
    if (children[parentId]) {
        return children[parentId].findIndex(value => value.contentId === contentId);
    }
    else {
        return -1;
    }
}


export const getRootParent = (id: string): number | undefined => {

    let rootParentIndex: number | undefined;
    const content = getContent({ id })

    if (content) {
        let parentId = content.parentId;

        if (parentId) {
            rootParentIndex = getRootParent(parentId)
        } else {
            parentId = parentClass;
            const childIndex = getChildrenIndex({ contentId: id, parentId: parentClass })
            rootParentIndex = childIndex;
        }
    } else {
        console.error(" content with id ", id, " doesn't exist")
    }
    return rootParentIndex
}
