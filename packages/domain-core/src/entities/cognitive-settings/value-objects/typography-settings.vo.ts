import { FontFamily } from '../enums/font-family.enum';
import { LineHeight } from '../enums/line-height.enum';
import { LetterSpacing } from '../enums/letter-spacing.enum';
import { TextSize } from '../enums/text-size.enum';

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
