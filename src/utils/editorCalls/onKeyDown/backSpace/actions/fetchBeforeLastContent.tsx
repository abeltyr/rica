import { EditorStateContentType } from '@/interface/editor';
import { parentClass } from '@/utils/commons';
import { fetchLastChild, getChildren, getChildrenIndex, getContent } from '@/utils/editors/data';

export const fetchBeforeLastContent = (id: string): EditorStateContentType | undefined => {
    let finalContent: EditorStateContentType | undefined;

    const currentContent = getContent({ id });

    if (!currentContent.parentId) return;

    if (currentContent.parentId === parentClass) return

    const parentContent = getContent({ id: currentContent.parentId });
    if (!parentContent.children) return;

    const parentChildren = getChildren({ parentId: parentContent.children })
    const index = getChildrenIndex({ contentId: currentContent.id, parentId: parentContent.id })

    if (index > 0) {
        const previousContentID = parentChildren[index - 1].contentId
        const newContent = getContent({ id: previousContentID });
        if (newContent.content) {
            finalContent = newContent;
        }
        else if (newContent.children) {
            const content = fetchLastChild(newContent)
            if (content) finalContent = content
        }
    } else {
        const content = fetchBeforeLastContent(parentContent.id)
        if (content) finalContent = content
    }
    return finalContent;
}