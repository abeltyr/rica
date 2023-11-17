export const onPaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');

    // Now you can do something with the pasted text
    console.log("pastedText", pastedText);
    const lines = pastedText.split(/\r?\n/);

    console.log("lines", lines);

}