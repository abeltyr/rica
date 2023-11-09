import { removeChildren } from '../children/remove';
import { getContent } from '../content';
import { root } from './data';


export const removeRoot = async ({ index }: { index: number, }) => {
    if (root[index]) {
        const content = getContent({ id: root[index] })

        if (content) {
            if (content.children) {
                await removeChildren({ parentId: content.children })
            }
        }
        root.splice(index, 1);
    }
}


