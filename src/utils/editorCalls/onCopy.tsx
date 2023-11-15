export const onCopy = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const clipboardData = event;
    // const pastedText = clipboardData.getData('text');

    // Now you can do something with the pasted text
    // console.log("pastedText", clipboardData);
    // const lines = pastedText.split(/\r?\n/);

    // console.log("lines", lines);


}