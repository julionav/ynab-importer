import React from "react";
import { useDropzone } from "react-dropzone";

function App() {
  const onDrop = React.useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="bg-green-400 min-h-screen font-sans">
      <div className="pt-20">
        <div
          className="mx-auto bg-white rounded w-1/2 max-w-3xl flex h-64 justify-center items-center"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
