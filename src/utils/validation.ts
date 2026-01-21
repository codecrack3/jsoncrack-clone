import { ParseError } from 'jsonc-parser';
import { offsetToPosition } from './parser';
import { ValidationMarker, SEVERITY } from '../types';

/**
 * Convert jsonc-parser parse errors to Monaco validation markers
 */
export function createValidationMarkers(
  errors: ParseError[],
  text: string
): ValidationMarker[] {
  return errors.map((error) => {
    const start = offsetToPosition(text, error.offset);
    const end = offsetToPosition(text, error.offset + error.length);

    return {
      severity: SEVERITY.ERROR,
      message: getErrorMessage(error.error),
      startLineNumber: start.line,
      startColumn: start.column,
      endLineNumber: end.line,
      endColumn: end.column,
    };
  });
}

/**
 * Get human-readable error message from parse error code
 */
function getErrorMessage(errorCode: unknown): string {
  const errorMessages: Record<string, string> = {
    InvalidSymbol: 'Invalid symbol',
    InvalidNumberFormat: 'Invalid number format',
    PropertyNameExpected: 'Property name expected',
    ValueExpected: 'Value expected',
    ColonExpected: 'Colon expected',
    CommaExpected: 'Comma expected',
    CloseBraceExpected: 'Closing brace expected',
    CloseBracketExpected: 'Closing bracket expected',
    EndOfFileExpected: 'Unexpected end of input',
    InvalidCommentToken: 'Invalid comment token',
    UnexpectedEndOfComment: 'Unexpected end of comment',
    UnexpectedEndOfString: 'Unexpected end of string',
    InvalidUnicode: 'Invalid unicode escape sequence',
    InvalidEscapeCharacter: 'Invalid escape character',
  };

  const code = String(errorCode);
  return errorMessages[code] || 'Unknown error';
}
