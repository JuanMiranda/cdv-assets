#!/usr/bin/env node
'use strict';
var meow = require('meow');
var chalk = require('chalk');
var cdvAssets = require('./');

var cli = meow({
    help: [
        '',
        chalk.green.bold('cdv-assets@1.0.0'),
        '',
        'Use this tool to generate all the required assets for a cordova/ionic/phonegap application',
        '(*) Currently supports Android and IOS platforms',
        '',
        'Usage: ',
        '   $ cdv-assets <platform> [options] ',
        '',
        'Platform: ',
        '   all             android and IOS assets',
        '   android         Only Android assets',
        '   ios             Only ios assets',    
        '',
        'Options: ',
        '   -i              Generate only icons',
        '   -s              Generate only splashscreens',
        '',
        'Note: The current directory must have the required files:',
        '- for icons: An icon.png file with a minimum size of 1024 x 1024 pixels.',
        '- for splash: An splash.png file with a minimum size of 2732 x 2732 pixels.',
        '',
        'Output Dir: ./{platform}/icon/  ./{platform}/splash/ ',
        '',
    ].join('\n'),
    description: false


});

var promise = null;

if (cli.input.length == 1 && (['all','android','ios']).indexOf(cli.input[0]) > -1) {
    promise = cdvAssets(cli.input[0], cli.flags);
} else {
    console.error(chalk.red.bold('Invalid command. Use --help for usage description.'));
}
