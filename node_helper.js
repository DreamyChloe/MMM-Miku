const NodeHelper = require("node_helper")
const imageLoader = require("./src/image_loader")

module.exports = NodeHelper.create({
    socketNotificationReceived: function (notification, payload) {
        if (notification === "GET_IMAGE_LIST") {
            this.getImageList(payload)
        }
    },

    getImageList: function (imageFolderPath) {
        imageLoader.getImageList(imageFolderPath, __dirname)
            .then((imageFiles) => {
                this.sendSocketNotification("IMAGE_LIST", imageFiles)
            })
            .catch((err) => {
                console.error("Error getting image list:", err.message)
                this.sendSocketNotification("IMAGE_LIST_ERROR", err.message)
            })
    }
})
