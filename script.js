const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); // Load environment variables from config.env file

// Importing all the collections
const brand = require("./src/models/brand.js");
const category = require("./src/models/category.js");
const color = require("./src/models/color.js");
const location = require("./src/models/location.js");
const order = require("./src/models/order.js");
const product = require("./src/models/product.js");
const profile = require("./src/models/profile.js");
const review = require("./src/models/Review.js");
const verification_factor = require("./src/models/verification_factor");

// Storing these models as values to the object whose keys are the model names
const models = {
    brand,
    category,
    color,
    location,
    order,
    product,
    profile,
    review,
    verification_factor
};

// Connecting to Atlas DB
const geturl = require("./src/utils/get_connection_url.js")
const url = geturl(process.env.databasename, process.env.user, process.env.password);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch((err) => console.log("\x1b[31m%s\x1b[0m", "Error encountered:", err)); // Red color for errors

const db = mongoose.connection;

db.once("open", () => {
    console.log("\033[104mPort used for MongoDB connection:\033[0m", db.port);
});

db.on("error", (err) => {
    console.log("\x1b[31m%s\x1b[0m", "MongoDB connection error:", err); // Red color for errors
});

// Checking if the file exists and if the path for JSON data to be uploaded is given
const file_path = process.argv?.[4] || "./data.json";

if (process.argv?.[2] !== '--delete' && process.argv?.[2] !== '-d') {
    console.log("\x1b[33m%s\x1b[0m", "Delete is not happening"); // Yellow color for delete action
    if (!fs.existsSync(file_path)) {
        console.error("\x1b[31m%s\x1b[0m", `Specified file path ${file_path} does not exist`); // Red color for errors
        process.exit();
    }
    console.log(file_path);
}

// Looking out for the collection argument
const collectionName = process.argv?.[3] || "product";
const collection = models[collectionName];
if (!collection) {
    console.error("\x1b[31m%s\x1b[0m", `Invalid collection name: ${collectionName}`); // Red color for errors
    process.exit();
}
console.log(`Using collection: ${collectionName}`);

// Executing the operations based on the given CLI command that could be import or delete
if (!process.argv?.[2]) {
    console.error("\x1b[31m%s\x1b[0m", "No command was specified. Use --import/-i to import all the files or --delete/-d to delete all the files"); // Red color for errors
    process.exit();
}

switch (process.argv?.[2]) {
    case "--import":
    case "-i":
        importData();
        break;
    case "--delete":
    case "-d":
        deleteData();
        break;
    default:
        console.error("\x1b[31m%s\x1b[0m", "Invalid command. Use --import/-i to import all the files or --delete/-d to delete all the files"); // Red color for errors
        process.exit();
}

async function importData() {
    try {
        const data = JSON.parse(fs.readFileSync(file_path, 'utf-8'));
        
        // Using create instead of insertMany
        await collection.create(data);
        
        console.log("\x1b[32m%s\x1b[0m", "Data imported successfully!"); // Green color for successful import
        process.exit();
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "Error importing data:", error); // Red color for errors
        process.exit(1);
    }
}

async function deleteData() {
    try {
        await collection.deleteMany({});
        console.log("\x1b[33m%s\x1b[0m", "Data deleted successfully!"); // Yellow color for delete action
        process.exit();
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "Error deleting data:", error); // Red color for errors
        process.exit(1);
    }
}

// In case of any exception encountered
process.on("uncaughtException", (err) => {
    console.log("\x1b[31m%s\x1b[0m", "Uncaught exception:", err); // Red color for errors
    console.log("\x1b[33m%s\x1b[0m", "Usage: node script --import/-i||--delete/-d collection_name file_path_of_data_you_want_to_upload"); // Yellow color for usage instructions
    process.exit();
});
