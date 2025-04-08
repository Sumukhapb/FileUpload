require("dotenv").config(); // Load DB credentials if needed

const mongoose = require("mongoose");
const File = require("./models/files"); // Adjust path if needed

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
    const files = await File.find({});
    for (let file of files) {
      if (
        file.path.includes("backend\\uploads\\") ||
        file.path.includes("backend/uploads/")
      ) {
        const parts = file.path.split(/uploads[\\/]/); // split by both / and \
        file.path = `uploads/${parts[1]}`;
        await file.save();
        console.log(`✔ Fixed path for: ${file.filename}`);
      }
    }
    console.log("All paths fixed!");
  } catch (err) {
    console.error("Error fixing paths:", err);
  } finally {
    mongoose.connection.close();
  }
});
