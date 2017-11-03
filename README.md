# cdv-assets

> Use this tool to generate all the required assets for a cordova/ionic/phonegap application.
> (*) Currently supports Android and IOS platforms.

## Install
Install globally via [npm](npmjs.org):

```bash
$ npm install -g cdv-assets
```

## Usage
Run this tool 

```bash
$ cdv-assets <platform> [options]
```

###Platform:
- all             android and IOS assets
- android         Only Android assets
- ios             Only ios assets  
        
###Options:
- -i              Generate only icons
- -s              Generate only splashscreens

>* Note: The current directory must have the required files:
>   - for icons: An icon.png file with a minimum size of 1024 x 1024 pixels.
>   - for splash: An splash.png file with a minimum size of 2732 x 2732 pixels.

## Author

**[Juan Miranda](https://github.com/JuanNorsync)**

## License
MIT. Copyright (c) 2017-11-02 Juan Miranda, contributors.
