import React from "react";
import { useDropzone } from "react-dropzone";
import { csvToCollection } from "./csv";

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
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    return readFile(acceptedFiles[0])
      .then(csvToCollection)
      .then((collection) => console.log({ collection }));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="pt-20 space-y-4 w-1/2 mx-auto">
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
    </div>
  );
}

export default App;
