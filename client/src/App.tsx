/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./App.css";
import { CloudUpload, RotateCw } from "lucide-react";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import uploadLotie from "../src/assets/uploading.lottie";
import successLottie from "../src/assets/success.lottie";
import socket from "./socket/socket";
import FileVerificationCard from "./components/file-verification";

function App() {
  const [file, setFile] = useState<any>(null);
  const [howMuchUploaded, setHowMuchUploaded] = useState(0);
  const [uploadedFileCurrentStatus, setUploadedFileCurrentStatus] = useState<{
    step: string;
    percent: number;
  }>({ step: "", percent: 0 });

  useEffect(() => {
    socket.on("progress", (data) => {
      console.log(data);
      setUploadedFileCurrentStatus(data);
      if (data.percent === 100) {
        setFile(null);
        setTimeout(() => {
          setUploadedFileCurrentStatus({step: "", percent: 0})
        }, 2000);
      }
    });
  }, []);

  const handleFile = async () => {
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);

    await axios
      .post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "socket-id": socket.id,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent?.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent?.total,
            );
            setHowMuchUploaded(percent);
          }
        },
      })
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          setHowMuchUploaded(0);
          setFile(null);
        }, 2500);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      {uploadedFileCurrentStatus.percent > 0 && (
        <FileVerificationCard
          step={uploadedFileCurrentStatus.step}
          percent={uploadedFileCurrentStatus.percent}
        />
      )}

      {howMuchUploaded > 0 && (
        <div>
          {howMuchUploaded !== 100 ? (
            <DotLottieReact src={uploadLotie} autoplay loop />
          ) : (
            <DotLottieReact src={successLottie} autoplay loop />
          )}
          <h4 className="progress-number">
            {howMuchUploaded < 100
              ? `So far ${howMuchUploaded}% Done...`
              : `Upload Complete`}
          </h4>
        </div>
      )}

      {/* File handling */}
      {(!file && howMuchUploaded == 0 && uploadedFileCurrentStatus.percent == 0) && (
        <>
          <input
            style={{ display: "none" }}
            type="file"
            name="movie"
            id="movie"
            onChange={(e) => setFile(e.target?.files?.[0])}
          />
          <label className="button" htmlFor={"movie"}>
            Select a File
          </label>
        </>
      )}
      {file && howMuchUploaded == 0 && (
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-4 file-name">
            <CloudUpload strokeWidth={2.5} />
            <p>{file?.name}</p>
          </div>
          <div className="file-name cursor-pointer">
            <RotateCw onClick={() => setFile(null)} strokeWidth={2.5} />
          </div>
          <button type="button" onClick={handleFile}>
            Upload
          </button>
        </div>
      )}
    </>
  );
}

export default App;
