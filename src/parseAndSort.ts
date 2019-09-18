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

function getStyleNameFromObjectProperty(property: ObjectProperty): string | null {
  if (isIdentifier(property.key)) {
    return hyphenateStyleName(property.key.name);
  }

  if (isStringLiteral(property.key)) {
    return pseudo.indexOf(property.key.value) !== -1 ? property.key.value : hyphenateStyleName(property.key.value);
  }

  return null;
}

function getSortedProperties(properties: TProperties): TProperties {
  const rational: TProperties = [];
  const missing: TProperties = [];

  // those properties will be placed at the end of the object in the order they're declared
  const footer: TProperties = properties.filter(property => {
    if (property.type === "SpreadElement" || property.type === "ObjectMethod") {
      return true;
    }

    if (property.type === "ObjectProperty") {
      return property.computed;
    }

    return false;
  });

  const knownProperties = groups.reduce((a, b) => a.concat(b), []);

  properties.forEach(property => {
    if (property.type !== "ObjectProperty") {
      return;
    }

    const key = getStyleNameFromObjectProperty(property);

    // those properties are the ones we don't know how to sort...so keep them in the `missing` array in the order that
    // they're declared and they'll will be put back in the end of the object
    if (key && knownProperties.indexOf(key) === -1) {
      missing.push(property);
    }
  });

  groups.forEach(cssProperties => {
    cssProperties.forEach(cssProperty => {
      const property = properties.find(property => {
        if (footer.indexOf(property) !== -1) {
          return false;
        }

        if (property.type === "ObjectProperty") {
          const styleName = getStyleNameFromObjectProperty(property);
          return styleName === cssProperty;
        }

        return false;
      });

      if (property) {
        rational.push(property);
      }
    });
  });

  return rational.concat(missing).concat(footer);
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
