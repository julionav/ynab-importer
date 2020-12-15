// Future me: use the csv python module as inspiration

function parseLine(line: string): string[] {
  return line.split(",");
}

function parseCSV(csv: string): string[][] {
  // This loads the whole file. Maybe there is a way to load line by line
  // from a buffer.
  const lines = csv.split("\n");
  return lines.map(parseLine);
}

export function csvToCollection(csv: string): object {
  const parsed = parseCSV(csv);
  const headers = parsed[0];
  const collection: object[] = [];
  for (let line of parsed.slice(1)) {
    const lineObj: { [key: string]: string } = {};
    for (let position = 0; position < line.length; position++) {
      lineObj[headers[position]] = line[position];
    }
    collection.push(lineObj);
  }
  return collection;
}
