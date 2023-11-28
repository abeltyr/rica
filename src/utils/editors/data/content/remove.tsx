import { contents } from './data';

export const removeContent = ({ id }: { id: string, }) => {
    delete contents[id];
    const node = document.getElementById(id);
    if (node) node.remove();
}

