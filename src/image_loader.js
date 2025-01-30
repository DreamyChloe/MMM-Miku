const fs = require("fs").promises
const path = require("path")

module.exports = {
    getImageList: async function (imageFolderPath, moduleDir) {
        try {
            const fullPath = path.join(moduleDir, "..", "..", imageFolderPath)
            const files = await fs.readdir(fullPath)
            const imageFiles = files.filter(file =>
                [".jpg", ".jpeg", ".png", ".gif"].includes(path.extname(file).toLowerCase())
            )
            return imageFiles
        } catch (err) {
            console.error("Error reading directory:", err.message)
            throw new Error(`Failed to read image directory: ${err.message}`)
        }
    }
}
