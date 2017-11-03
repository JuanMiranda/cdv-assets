'use strict';

var fs = require('fs-extra');
var path = require('path');
var ig = require('imagemagick');
var colors = require('colors');
var Q = require('q');
//var argv = require('minimist')(process.argv.slice(2));

/**
 * @var {Object} settings - names of the config file and of the splash image
 */
var settings = require('./settings.json');

var platforms = [];
var genTypes = [];

/**
 * Checks if the required PNGs are available in the current folder
 *
 * @return   {Promise}   resolves if the required PNGs are available in the current folder
 */
var checkSeedFiles = function () {
    var deferred = Q.defer();
    var all = [];
    genTypes.forEach(function (type) {
        all.push(validFileExists(type));
    });
    Q.all(all).then(function () {
        deferred.resolve();
    })
    return deferred.promise;
};

/**
 * Checks if a valid file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var validFileExists = function (type) {
    var deferred = Q.defer();

    fs.access(settings[type + "Filename"], fs.constants.F_OK, function(err){
        if (!err) {
            display.success(settings[type + "Filename"] + ' exists');
            deferred.resolve();
        } else {
            display.error(settings[type + "Filename"] + ' does not exist');
            deferred.reject();
        }
    });
    
    return deferred.promise;
};

/**
* @var {Object} console utils
*/
var display = {};
display.success = function (str) {
    str = '✓  '.green + str;
    console.log('  ' + str);
};
display.error = function (str) {
    str = '✗  '.red + str;
    console.log('  ' + str);
};
display.header = function (str) {
    console.log('');
    console.log(' ' + str.cyan.underline);
    console.log('');
};

/**
* Crops and creates a new splash in the platform's folder.
*
* @param  {Object} platform
* @param  {Object} splash
* @return {Promise}
*/
var generateSplash = function (platform, splash) {
    var deferred = Q.defer();
    var srcPath = settings.splashFilename;
    
    var dstPath = platform + '/splash/' + splash.filename;
    var dst = path.dirname(dstPath);
    if (!fs.existsSync(dst)) {
        fs.mkdirsSync(dst);
    }
    ig.crop({
        srcPath: srcPath,
        dstPath: dstPath,
        quality: 1,
        format: 'png',
        width: splash.width,
        height: splash.height
    }, function (err, stdout, stderr) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
            display.success(splash.filename + ' created');
        }
    });
    return deferred.promise;
};

/**
 * Resizes, crops (if needed) and creates a new icon in the platform's folder.
 *
 * @param  {Object} platform
 * @param  {Object} icon
 * @return {Promise}
 */
var generateIcon = function (platform, icon) {
    var deferred = Q.defer();
    var srcPath = settings.iconFilename;
    var dstPath = platform + '/icon/' + icon.filename;
    var dst = path.dirname(dstPath);
    if (!fs.existsSync(dst)) {
        fs.mkdirsSync(dst);
    }
    ig.resize({
        srcPath: srcPath,
        dstPath: dstPath,
        quality: 1,
        format: 'png',
        width: icon.width,
        height: icon.height
    }, function (err, stdout, stderr) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
            display.success(icon.filename + ' created');
        }
    });
    return deferred.promise;
};

/**
* Generates splash based on the platform object
*
* @param  {Object} platform
* @return {Promise}
*/
var generateAssetsForPlatform = function (platform) {
    var deferred = Q.defer();
    display.header('Generating assets for ' + platform);
    var all = [];
    if (genTypes.indexOf('icon') > -1) {
        var icons = settings[platform].icon;
        icons.forEach(function (icon) {
            all.push(generateIcon(platform, icon));
        });
    }
    if (genTypes.indexOf('splash') > -1) {
        var splashes = settings[platform].splash;
        splashes.forEach(function (splash) {
            all.push(generateSplash(platform, splash));
        });
    }
    Q.all(all).then(function () {
        deferred.resolve();
    }).catch(function (err) {
        console.log(err);
    });
    return deferred.promise;
};

/**
* Goes over all the platforms and triggers splash screen generation
*
* @param  {Array} platforms
* @return {Promise}
*/
var generateAssets = function () {
    var deferred = Q.defer();
    var sequence = Q();
    var all = [];
    platforms.forEach(function (platform) {
        sequence = sequence.then(function () {
            return generateAssetsForPlatform(platform);
        });
        all.push(sequence);
    });
    Q.all(all).then(function () {
        deferred.resolve();
    });
    return deferred.promise;
};

function init(platform, flags) {

    display.header('Starting icons generation');

    platforms = (platform == 'all' ? ['android','ios'] : [platform]);
    genTypes = (!flags.i && !flags.s ? ['icon', 'splash'] : (!flags.i ? ['splash'] : (!flags.s ? ['icon'] : ['icon', 'splash'])));

    checkSeedFiles()
        .then(generateAssets)
        .catch(function (err) {
            if (err) {
                console.log(err);
            }
        }).then(function () {
            display.success('Assets were created!');
        });
}
    
module.exports = init;
