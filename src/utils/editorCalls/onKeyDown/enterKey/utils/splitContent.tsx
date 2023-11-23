import { EditorStateContentType } from '@/interface/editor';
import { upsetContent } from '@/utils/editors/data';
import { v4 } from 'uuid';

export const splitContent = ({ contentData, caretPosition, newRootId, updatedParentId }: { contentData: EditorStateContentType, caretPosition: number, newRootId?: string, updatedParentId?: string }) => {

    let updatedContent: EditorStateContentType | undefined;
    let newContent: EditorStateContentType | undefined;

    if (contentData.content) {
        const updatedValue = contentData.content.substring(0, caretPosition)
        const newValue = contentData.content.substring(caretPosition, contentData.content.length)

        if (updatedValue.length > 0) updatedContent = {
            ...contentData,
            content: updatedValue,
            children: undefined,
            parentId: updatedParentId
        }

        if (newValue.length > 0)
            newContent = {
                ...contentData,
                id: v4(),
                parentId: newRootId,
                content: newValue,
                children: undefined
            }

        if (updatedContent) upsetContent({ id: updatedContent.id, value: updatedContent })
        if (newContent) upsetContent({ id: newContent.id, value: newContent })
    }

    return { updatedContent, newContent }

}