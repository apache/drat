# DRAT webpage

Under construction page for DRAT :-)

Status: work in progress

# Development

In order to improve the usage of this page for mobile customers apply the following optimizations as recommended from [Google Insights](https://developers.google.com/speed/pagespeed/insights/)

## Minification

### Source files

In order to minify resources you may use:
```
$ java -jar ~/Downloads/yuicompressor-2.4.8.jar -o '.css$:-min.css' *.css
$ java -jar ~/Downloads/yuicompressor-2.4.8.jar -o '.js$:-min.js' *.js
```
after downloading the [YUI compressor](https://yui.github.io/yuicompressor/)

### Pictures

To optimize pictures you may rely on
* [jpegoptim](http://freecode.com/projects/jpegoptim/)

In order to see potential just run this in a terminal:
```
$ jpegoptim * -n
banner.jpg 1440x900 24bit N Exif XMP Adobe  [OK] 34992 --> 34991 bytes (0.00%), optimized.

To actually change files:
$ jpegoptim * -t
```
