
export const updateTextValue = ({ id, value }: { id: string, value: string }) => {
    const node = document.getElementById(id);
    if (node)
        node.textContent = value;
}
