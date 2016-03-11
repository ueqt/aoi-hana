#!/bin/bash

echo 'Start compressing for Mac OS X.'
tar zcf 'dist/mac-osx.tar.gz' 'dist/AoiHana-darwin-x64'
echo 'Compressing for Mac OS X succeed.'

echo 'Start compressing for Linux x64.'
tar zcf 'dist/linux-x64.tar.gz' 'dist/AoiHana-linux-x64'
echo 'Compressing for Linux x64 succeed.'

echo 'Start compressing for Linux ia32.'
tar zcf 'dist/linux-ia32.tar.gz' 'dist/AoiHana-linux-ia32'
echo 'Compressing for Linux ia32 succeed.'

echo 'Start compressing for Windows x64.'
tar zcf 'dist/win32-x64.tar.gz' 'dist/AoiHana-win32-x64'
echo 'Compressing for Windows x64 succeed.'

echo 'Start compressing for Windows ia32.'
tar zcf 'dist/win32-ia32.tar.gz' 'dist/AoiHana-win32-ia32'
echo 'Compressing for Windows ia32 succeed.'