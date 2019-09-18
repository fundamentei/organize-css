import hyphenateStyleName from "../hyphenateStyleName";

describe("hyphenateStyleName", () => {
  it("hyphenates border properties", () => {
    const properties = [
      "borderBlockColor",
      "borderBlockEndColor",
      "borderBlockEndStyle",
      "borderBlockEndWidth",
      "borderBlockStartColor",
      "borderBlockStartStyle",
      "borderBlockStartWidth",
      "borderBlockStyle",
      "borderBlockWidth",
      "borderBottomColor",
      "borderBottomLeftRadius",
      "borderBottomRightRadius",
      "borderBottomStyle",
      "borderBottomWidth",
      "borderCollapse",
      "borderEndEndRadius",
      "borderEndStartRadius",
      "borderImageOutset",
      "borderImageRepeat",
      "borderImageSlice",
      "borderImageSource",
      "borderImageWidth",
      "borderInlineColor",
      "borderInlineEndColor",
      "borderInlineEndStyle",
      "borderInlineEndWidth",
      "borderInlineStartColor",
      "borderInlineStartStyle",
      "borderInlineStartWidth",
      "borderInlineStyle",
      "borderInlineWidth",
      "borderLeftColor",
      "borderLeftStyle",
      "borderLeftWidth",
      "borderRightColor",
      "borderRightStyle",
      "borderRightWidth",
      "borderSpacing",
      "borderStartEndRadius",
      "borderStartStartRadius",
      "borderTopColor",
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderTopStyle",
      "borderTopWidth"
    ];

    expect(properties.map(hyphenateStyleName)).toMatchSnapshot();
  });

  it("hyphenates WebKit CSS properties", () => {
    const properties = [
      "WebkitBoxAlign",
      "WebkitBoxDirection",
      "WebkitBoxFlex",
      "WebkitBoxFlexGroup",
      "WebkitBoxLines",
      "WebkitBoxOrdinalGroup",
      "WebkitBoxOrient",
      "WebkitBoxPack",
      "WebkitScrollSnapPointsX",
      "WebkitScrollSnapPointsY"
    ];

    expect(properties.map(hyphenateStyleName)).toMatchSnapshot();
  });
});
