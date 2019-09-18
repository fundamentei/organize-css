import generate from "@babel/generator";
import * as babel from "@babel/parser";
import traverse from "@babel/traverse";
import {
  ExpressionStatement,
  isArrowFunctionExpression,
  isExpressionStatement,
  isIdentifier,
  isObjectExpression,
  isStringLiteral,
  ObjectMethod,
  ObjectProperty,
  SpreadElement
} from "@babel/types";
import groups from "./groups";
import pseudo from "./groups/pseudo";
import hyphenateStyleName from "./hyphenateStyleName";

type TProperties = Array<ObjectMethod | ObjectProperty | SpreadElement>;

function getSortedProperties(properties: TProperties): TProperties {
  const rational: TProperties = [];
  const footer: TProperties = properties.filter(property => {
    return property.type === "SpreadElement" || property.type === "ObjectMethod";
  });

  groups.forEach(cssProperties => {
    cssProperties.forEach(cssProperty => {
      const property = properties.find(property => {
        if (property.type === "ObjectProperty") {
          if (isIdentifier(property.key)) {
            const hyphenated = hyphenateStyleName(property.key.name);
            return cssProperty === hyphenated;
          }

          if (isStringLiteral(property.key)) {
            if (pseudo.indexOf(property.key.value) !== -1) {
              return cssProperty === property.key.value;
            }
          }
        }

        return false;
      });

      if (property) {
        rational.push(property);
      }
    });
  });

  return rational.concat(footer);
}

export default async function parseAndSort(objectExpression: string): Promise<string | null> {
  try {
    const ast = await babel.parse(`() => (${objectExpression})`, {
      sourceType: "module"
    });

    if (!ast) {
      return null;
    }

    traverse(ast, {
      ObjectExpression: path => {
        path.node.properties = getSortedProperties(path.node.properties);
      }
    });

    if (!isExpressionStatement(ast.program.body[0])) {
      return null;
    }

    const expression = (ast.program.body[0] as ExpressionStatement).expression;

    if (!isArrowFunctionExpression(expression) || !isObjectExpression(expression.body)) {
      return null;
    }

    const generated = generate(expression.body);
    return generated ? generated.code : null;
  } catch (err) {
    return null;
  }
}
