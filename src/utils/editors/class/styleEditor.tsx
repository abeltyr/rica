import { TextAlignment } from '@/interface/editor';

export const alignmentCheck = (alignmentFormate?: TextAlignment) => {
    let alignment = "text-start";

    if (alignmentFormate === "Center")
        alignment = "text-center"
    else if (alignmentFormate === "End")
        alignment = "text-end"
    else if (alignmentFormate === "Justify")
        alignment = "text-justify"

    return alignment
}

export const indentSetup = (indent: number) => {
    if (indent === 0)
        return "ml-0";

    const indentAmount = indent * 20;
    return `ml-[${indentAmount}px]`
}

