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
});

function loadCase(filename: string) {
  return fs.readFileSync(`${__dirname}/cases/${filename}`).toString("utf8");
}
