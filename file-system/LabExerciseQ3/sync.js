const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "source");
const destinationDir = path.join(__dirname, "destination");

function checkDirectory(dir) {
    if (!fs.existsSync(dir)) {
        console.error(`Directory not found: ${dir}`);
        process.exit(1);
    }
}

function syncDirectories(src, dest) {
    try {
        const files = fs.readdirSync(src);

        files.forEach(file => {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);

            const srcStat = fs.statSync(srcPath);

            if (!fs.existsSync(destPath)) {
                fs.copyFileSync(srcPath, destPath);
                console.log(`Copied file: ${file}`);
            } else {
                const destStat = fs.statSync(destPath);
                if (srcStat.mtime > destStat.mtime) {
                    fs.copyFileSync(srcPath, destPath);
                    console.log(`Updated file: ${file}`);
                }
            }
        });

        console.log("Synchronization completed successfully.");
    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkDirectory(sourceDir);
checkDirectory(destinationDir);
syncDirectories(sourceDir, destinationDir);
