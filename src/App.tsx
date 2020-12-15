import React from "react";
import { useDropzone } from "react-dropzone";

function App() {
  const onDrop = React.useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="pt-20 space-y-4 w-1/2 mx-auto">
        <h1 className="text-2xl">Convert your CSV file to YNAB format</h1>
        <div
          className="mx-auto bg-white rounded flex h-64 justify-center items-center"
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
