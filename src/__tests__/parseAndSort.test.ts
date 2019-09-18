import * as fs from "fs";
import parseAndSort from "../parseAndSort";

describe("parseAndSort", () => {
  it.each(["1.txt", "2.txt", "3.txt"])("works for the case %s", async filename => {
    const withSortedCSSProperties = await parseAndSort(loadCase(filename));
    expect(withSortedCSSProperties).toMatchSnapshot();
  });

  it("is null if the JS couldn't be parsed", async () => {
    const withSortedCSSProperties = await parseAndSort("[}");
    expect(withSortedCSSProperties).toBe(null);
  });

  it("keeps spread elements in the order that they're declared", async () => {
    const withSortedCSSProperties = await parseAndSort(`{ ...a, display: "flex", ...b, ...c }`);
    expect(withSortedCSSProperties).toMatchSnapshot();
  });

  it("doesn't touch computed properties", async () => {
    const withSortedCSSProperties = await parseAndSort(`{ ...a, [display]: "flex", ...b, ...c }`);
    expect(withSortedCSSProperties).toMatchSnapshot();
  });

  it("sorts nested declarations", async () => {
    const withSortedCSSProperties = await parseAndSort(
      JSON.stringify({
        top: 0,
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
        "&:before": {
          top: 0,
          position: "absolute",
          left: 0,
          bottom: 0,
          right: 0,
          "&:hover": {
            top: 0,
            position: "absolute",
            left: 0,
            bottom: 0,
            right: 0
          }
        }
      })
    );

    expect(eval(`(${withSortedCSSProperties})`)).toStrictEqual({
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      "&:before": {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        "&:hover": {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      }
    });
  });

  it("doesn't remove properties that it doesn't know how to sort", async () => {
    const withSortedCSSProperties = await parseAndSort(
      JSON.stringify({
        WebkitAppearance: "none",
        display: "flex"
      })
    );

    expect(eval(`(${withSortedCSSProperties})`)).toStrictEqual({
      display: "flex",
      WebkitAppearance: "none"
    });
  });
});

function loadCase(filename: string) {
  return fs.readFileSync(`${__dirname}/cases/${filename}`).toString("utf8");
}
