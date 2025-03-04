Module.register("MMM-Miku", {
    requiresVersion: "2.29.0",
    defaults: {
        defaultDuration: 60000,
        defaultFadeSpeed: 0,
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

        this.validateSchedules()
        this.updateSchedule()
        let self = this
        setInterval(function () {
            self.updateSchedule()
        }, 60000) // Check schedule every minute
    },

    validateSchedules: function () {
        let validSchedules = 0
        this.config.schedule.forEach((schedule, index) => {
            if (this.isValidSchedule(schedule)) {
                validSchedules++
            } else {
                console.error(`MMM-Miku: Invalid schedule at index ${index}:`, schedule)
            }
        })
        console.log(`MMM-Miku: Successfully recognized ${validSchedules} out of ${this.config.schedule.length} schedules.`)
    },

    isValidSchedule: function (schedule) {
        return schedule.start && schedule.end && schedule.path
          && typeof schedule.start === "string" && typeof schedule.end === "string"
          && typeof schedule.path === "string"
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
        let now = this.timeToMinutes(time)
        let startTime = this.timeToMinutes(start)
        let endTime = this.timeToMinutes(end)

        if (startTime < endTime) {
            return now >= startTime && now < endTime
        } else {
            return now >= startTime || now < endTime
        }
    },

    timeToMinutes: function (time) {
        let parts = time.split(":")
        return parseInt(parts[0]) * 60 + parseInt(parts[1])
    },

    loadImageList: function () {
        this.sendSocketNotification("GET_IMAGE_LIST", this.currentSchedule.path)
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

        const fadeSpeed = this.currentSchedule.fadeSpeed ?? this.config.defaultFadeSpeed
        this.updateDom(fadeSpeed)

        this.updateTimer = setTimeout(() => {
            this.updateImage()
        }, this.currentSchedule.duration || this.config.defaultDuration)
    },

    getDom: function () {
        let wrapper = document.createElement("div")
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

        let img = document.createElement("img")
        img.src = this.currentSchedule.path + "/" + this.imageList[this.currentImageIndex]
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
