import express from "express";
import multer from "multer";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(cors());
io.on("connection", (socket) => console.log(socket.id));
// CODE BLOCK

const storageFolder = multer.diskStorage({
  destination: (req, res, cb) => cb(null, "uploaded-files/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage: storageFolder });

app.post("/upload", upload.single("file"), (req, res) => {
  const socketId = req.headers["socket-id"];
  res.json({ message: "File uploaded successfully!" });
  if(socketId){
      processFile(socketId)
  }
});

async function processFile(socketId) {
  const steps = [
    { percent: 10, step: "Waking up the server hamsters 🐹" },
    { percent: 20, step: "Scanning file for hidden ninjas 🥷" },
    { percent: 30, step: "Untangling digital spaghetti 🍝" },
    { percent: 40, step: "Teaching bytes to behave 📚" },
    { percent: 50, step: "Compressing file with a virtual hug 🤗" },
    { percent: 60, step: "Removing evil pixels 👿" },
    { percent: 70, step: "Polishing data until shiny ✨" },
    { percent: 80, step: "Convincing bits to stay in line 🚶" },
    { percent: 90, step: "Final boss fight with bugs 🐞⚔️" },
    { percent: 100, step: "Mission complete. File is awesome 🎉" }
  ];

  for (const item of steps) {
    io.to(socketId).emit("progress", item);
    await new Promise(r => setTimeout(r, 2000));
  }
}


// END OF CODE BLOCK
server.listen(5000, () => console.log("Server + Socket.IO running on port 5000"))
