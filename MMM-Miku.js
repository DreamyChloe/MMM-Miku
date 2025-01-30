Module.register("MMM-Miku", {
    requiresVersion: "2.29.0",
    defaults: {
        defaultDelay: 60000,
        fadeSpeed: 0,
        maxWidth: 340,
        maxHeight: 340,
        schedule: [],
    },

    start: function () {
        this.currentImageIndex = 0
        this.imageList = []
        this.currentSchedule = null
        this.updateTimer = null
        this.loaded = false

        this.updateSchedule()
        var self = this
        setInterval(function () {
            self.updateSchedule()
        }, 60000) // Check schedule every minute
    },

    updateSchedule: function () {
        const now = new Date()
        const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`

        const newSchedule = this.config.schedule.find(schedule =>
            this.isTimeInRange(currentTime, schedule.start, schedule.end)
        )

        if (newSchedule && this.currentSchedule !== newSchedule) {
            this.currentSchedule = newSchedule
            this.loadImageList()
        }
    },

    isTimeInRange: function (time, start, end) {
        var now = this.timeToMinutes(time)
        var startTime = this.timeToMinutes(start)
        var endTime = this.timeToMinutes(end)

        if (startTime < endTime) {
            return now >= startTime && now < endTime
        } else {
            return now >= startTime || now < endTime
        }
    },

    timeToMinutes: function (time) {
        var parts = time.split(":")
        return parseInt(parts[0]) * 60 + parseInt(parts[1])
    },

    loadImageList: function () {
        this.sendSocketNotification("GET_IMAGE_LIST", this.currentSchedule.imageFolderPath)
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "IMAGE_LIST") {
            this.imageList = payload
            this.loaded = true
            this.updateImage()
        }
    },

    updateImage: function () {
        if (this.imageList.length === 0) return

        this.currentImageIndex = this.currentSchedule.random
            ? Math.floor(Math.random() * this.imageList.length)
            : (this.currentImageIndex + 1) % this.imageList.length

        this.updateDom(this.config.fadeSpeed === 0 ? 0 : this.config.fadeSpeed)

        this.updateTimer = setTimeout(() => {
            this.updateImage()
        }, this.currentSchedule.delay || this.config.defaultDelay)
    },

    getDom: function () {
        var wrapper = document.createElement("div")
        wrapper.className = "miku-wrapper"
        wrapper.style.maxWidth = this.config.maxWidth + "px"
        wrapper.style.maxHeight = this.config.maxHeight + "px"

        if (!this.loaded) {
            wrapper.innerHTML = "Loading..."
            return wrapper
        }

        if (this.imageList.length === 0) {
            wrapper.innerHTML = "No images found"
            return wrapper
        }

        var img = document.createElement("img")
        img.src = this.currentSchedule.imageFolderPath + "/" + this.imageList[this.currentImageIndex]
        wrapper.appendChild(img)

        return wrapper
    },

    suspend: function () {
        if (this.updateTimer) {
            clearTimeout(this.updateTimer)
        }
    },

    resume: function () {
        this.updateSchedule()
        this.updateImage()
    },

    getStyles: function () {
        return ["MMM-Miku.css"]
    },
})
