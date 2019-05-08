import {
  createToken,
  Lexer,
  Parser,
  IToken,
  ILexingError,
  IRecognitionException
} from "chevrotain"

const True = createToken({ name: "True", pattern: /true/ })
const False = createToken({ name: "False", pattern: /false/ })
const Null = createToken({ name: "Null", pattern: /null/ })
const LCurly = createToken({ name: "LCurly", pattern: /{/ })
const RCurly = createToken({ name: "RCurly", pattern: /}/ })
const LSquare = createToken({ name: "LSquare", pattern: /\[/ })
const RSquare = createToken({ name: "RSquare", pattern: /]/ })
const Comma = createToken({ name: "Comma", pattern: /,/ })
const Colon = createToken({ name: "Colon", pattern: /:/ })
const StringLiteral = createToken({
    name: "StringLiteral",
    pattern: /"(:?[^\\"]|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
})
const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
})
const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /[ \t\n\r]+/,
    group: Lexer.SKIPPED
})

const allTokens = [
    WhiteSpace,
    NumberLiteral,
    StringLiteral,
    LCurly,
    RCurly,
    LSquare,
    RSquare,
    Comma,
    Colon,
    True,
    False,
    Null
]
const VinLexer = new Lexer(allTokens, {
  positionTracking: "onlyOffset"
})

LCurly.LABEL = "'{'";
RCurly.LABEL = "'}'";
LSquare.LABEL = "'['";
RSquare.LABEL = "']'";
Comma.LABEL = "','";
Colon.LABEL = "':'";

class VinParser extends Parser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  public json = this.RULE("json", () => {
    this.OR([
        // using ES6 Arrow functions to reduce verbosity.
        { ALT: () => this.SUBRULE(this.object) },
        { ALT: () => this.SUBRULE(this.array) }
    ])
})
public object = this.RULE("object", () => {
  this.CONSUME(LCurly)
  this.MANY_SEP({
      SEP: Comma,
      DEF: () => {
          this.SUBRULE2(this.objectItem)
      }
  })
  this.CONSUME(RCurly)
})

public objectItem = this.RULE("objectItem", () => {
  this.CONSUME(StringLiteral)
  this.CONSUME(Colon)
  this.SUBRULE(this.value)
})

public array = this.RULE("array", () => {
  this.CONSUME(LSquare)
  this.MANY_SEP({
      SEP: Comma,
      DEF: () => {
          this.SUBRULE(this.value)
      }
  })
  this.CONSUME(RSquare)
})

public value = this.RULE("value", () => {
  this.OR([
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.SUBRULE(this.object) },
      { ALT: () => this.SUBRULE(this.array) },
      { ALT: () => this.CONSUME(True) },
      { ALT: () => this.CONSUME(False) },
      { ALT: () => this.CONSUME(Null) }
  ])
})
}

export { VinParser, allTokens };
