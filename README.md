# MMM-Miku

A MagicMirror² module for displaying Hatsune Miku content to cheer you up.
(Of course you can also use it as a simple Diashow Viewer...)

![Example of MMM-Miku](example.gif)

## Description

MMM-Miku is a module for MagicMirror² that allows you to display images based on a customizable schedule to cheer you up over the day. It supports multiple time ranges with different image folders, random or sequential image display, and customizable update intervals.

## Install

In your terminal, go to your MagicMirror² Module folder, clone MMM-Miku, and install its dependencies:

   ```bash
   cd ~/MagicMirror/modules
   git clone https://github.com/DreamyChloe/MMM-Miku.git
   cd MMM-Miku
   npm install
   ```

## Update

To update the module, navigate to the module's folder, pull the latest changes, and reinstall dependencies:

```bash
cd ~/MagicMirror/modules/MMM-Miku
git pull
npm install
```

## Configuration

To use this module, add it to the `modules` array in the `config/config.js` file of your MagicMirror:

```javascript
{
    module: "MMM-Miku",
    position: "top_left",
    config: {
        schedule: [
            {
                start: "6:30",
                end: "23:00",
                path: "modules/MMM-Miku/images/day",
                duration: 5000,
                fadeSpeed: 1000
            },
            {
                start: "23:00",
                end: "6:30",
                path: "modules/MMM-Miku/images/night",
                duration: 10000,
                random: true
            }
        ],
        defaultDuration: 2000, 
        defaultFadeSpeed: 100,
        maxWidth: 340,
        maxHeight: 340
    }
}
```

### Configuration Options

| Option             | Description                                                                                                                       |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `schedule`         | An array of schedule objects defining when to display certain images.                                                             |
| `defaultDuration`  | The default duration (in milliseconds) for displaying each image when not specified in the schedule. Default is 60000 (1 minute). |
| `defaultFadeSpeed` | The default fadespeed (in milliseconds) for displaying each image when not specified in the schedule. Default is 0. |
| `maxWidth`         | The maximum width of the image container in pixels. Default is 340.                                                               |
| `maxHeight`        | The maximum height of the image container in pixels. Default is 340.                                                              |

#### Schedule Object

| Option | Description |
|--------|-------------|
| `start` | The start time for this schedule in 24-hour format (e.g., "10:00"). |
| `end` | The end time for this schedule in 24-hour format (e.g., "23:00"). |
| `path` | The path to the folder containing images for this schedule, relative to the MagicMirror application folder. |
| `duration` | (Optional) The duration each image is displayed before switching to the next one, in milliseconds. |
| `fadeSpeed` | (Optional) The speed of the fade animation when changing images, in milliseconds. |
| `random` | (Optional) If true, images are displayed in random order. If false or not set, images are displayed sequentially. |

## Images

All images included are illustrations by LamazeP. Please refrain from using them for any commercial purposes.

## Contributing

If you find any bugs or have suggestions for improvements, please open an issue on the [GitHub repository](https://github.com/DreamyChloe/MMM-Miku).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
