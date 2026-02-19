import { FontFamily } from '../enums/FontFamilyEnum';
import { LineHeight } from '../enums/LineHeightEnum';
import { LetterSpacing } from '../enums/LetterSpacingEnum';
import { TextSize } from '../enums/TextSizeEnum';

export class TypographySettings {
    fontFamily: FontFamily;
    lineHeight: LineHeight;
    letterSpacing: LetterSpacing;
    textSize: TextSize;

    constructor(
        fontFamily: FontFamily = FontFamily.System,
        lineHeight: LineHeight = LineHeight.Normal,
        letterSpacing: LetterSpacing = LetterSpacing.Normal,
        textSize: TextSize = TextSize.Normal,
    ) {
        this.fontFamily = fontFamily;
        this.lineHeight = lineHeight;
        this.letterSpacing = letterSpacing;
        this.textSize = textSize;
    }
}
