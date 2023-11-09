import { contents } from './data';

export const removeContent = ({ id }: { id: string, }) => {
    delete contents[id];
}

