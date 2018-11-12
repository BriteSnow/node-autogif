
Small ffmpeg wrapper to create animated gif from video. 

This is a very first iteration and only used and tested on Mac. Pull request for windows and linux support, welcome. 

> Note: For now, only used and tested on Mac, and supports only .mov. Feel free to log issue or do pull request. 

##### Usage

- `ffmpeg` needs to be install on the machine (this just call the `ffmpeg ...` commands)
- `sudo npm install -g autogif`
- Open terminal in the location of the `.mov` file(s)
- run `autogif`, this will create a .gif for each .mov
- run `autogif -w` to watch the directory for noew .mov
