import React from "react";
import { useDropzone } from "react-dropzone";
import { collectionToCSV, csvToCollection } from "./csv";
import { formatISO, parse } from "date-fns";

type BCPRow = {
  Fecha: string;
  Monto: string;
  Descripcion: string;
};

export type YANBRecord = {
  date: string;
  memo: string;
  outflow: string | null;
  inflow: string | null;
};

const CONVERSION_FACTOR = process.env.REACT_APP_CONVERSION_FACTOR || 3.55;

function bcpToYNAB(bcpCollection: BCPRow[]): YANBRecord[] {
  const ynabRecords: YANBRecord[] = [];
  for (let row of bcpCollection) {
    const date = parse(row.Fecha, "d/M/yyyy", new Date());
    const currency = row.Monto.match(/(S\/|US\$)/)![1];
    const value = parseFloat(
      row.Monto.replaceAll(new RegExp(/(S\/|US\$|\s)/g), "")
    );
    const valueInUSD = currency === "S/" ? value / CONVERSION_FACTOR : value;
    const inflow = valueInUSD > 0 ? valueInUSD : null;
    const outflow = valueInUSD < 0 ? valueInUSD * -1 : null;
    ynabRecords.push({
      date: formatISO(date, { representation: "date" }),
      inflow: inflow ? inflow.toFixed(2) : null,
      outflow: outflow ? outflow.toFixed(2) : null,
      memo: row.Descripcion,
    });
  }
  return ynabRecords;
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = (error) => reject(error);

    reader.readAsText(file);
  });
}

function App() {
  const [data, setData] = React.useState("");
  const [ynabCollection, setYNABCollection] = React.useState<
    YANBRecord[] | null
  >(null);
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    return readFile(acceptedFiles[0])
      .then(csvToCollection)
      .then((collection) => {
        setYNABCollection(bcpToYNAB(collection as BCPRow[]));
      });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="pt-20 w-1/2 mx-auto">
        {ynabCollection ? (
          <a
            href={`data:text/csv;charset=utf-8,${collectionToCSV(
              ynabCollection
            )}`}
            download="ynab.csv"
          >
            Download your file
          </a>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl">Convert your CSV file to YNAB format</h1>
            <div
              className="mx-auto border bg-white rounded flex h-64 justify-center items-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here ...</p>
              ) : (
                <p>Drag 'n' drop the CSV file here</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
