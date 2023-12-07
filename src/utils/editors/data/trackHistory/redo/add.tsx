import { EditorChildrenType, EditorStateContentType } from '@/interface/editor';
import { redoList } from './data';
import { parentClass } from '@/utils/commons';
import { ActionType, TrackHistoryListType, TrackHistoryType } from '@/interface/trackHistory';
import { getActualContent, getRootParentValue } from '../../content';
import { getChildren, getChildrenIndex } from '../../children';
import { getRedoListAtIndex } from '.';


export const insertToRedoList = ({ value, index, reset = false }: { value: TrackHistoryType, index: number, reset?: boolean }) => {

    let redoListData: TrackHistoryListType | undefined = getRedoListAtIndex(index);
    if (!redoListData || (redoListData && !redoListData.actionList) || reset) {
        redoListData = {
            actionList: value
        }
    } else {
        redoListData = {
            actionList: {
                ...redoListData.actionList,
                ...value
            }
        }
    }
    redoList[index] = redoListData;
}



const getInnerData = (value: EditorStateContentType) => {

    let contentsData: EditorStateContentType[] = []
    let childrenData: EditorChildrenType[] = []

    if (value.children) {

        const contentChildren = getChildren({
            parentId: value.children,
        })
        contentChildren.map((children, index) => {
            const content = getActualContent({ id: children.contentId });
            if (content) {

                contentsData = [...contentsData, content]

                const innerData = getInnerData(content)
                contentsData = [...contentsData, ...innerData.contentsData];
                childrenData = [...childrenData, ...innerData.childrenData];
            }
        })


        childrenData = [...childrenData, {
            [value.id]: contentChildren
        }]

    }


    return { contentsData, childrenData }
}