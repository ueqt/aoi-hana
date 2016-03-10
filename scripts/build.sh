#!/bin/bash

if ! hash electron-packager 2>/dev/null; then
  RED='\033[0;31m'
  NC='\033[0m'
  echo "${RED}Error${NC}: you need to npm install electron-packager. Aborting."
  exit 1
fi

if [ "$#" -ne 2 ]; then
  echo -e "Usage: ./script/build.sh <platform> <arch>"
  echo -e "	platform:	darwin, linux, win32"
  echo -e "	arch:		ia32, x64"
  exit 1
fi

PLATFORM=$1
ARCH=$2
#VERSION="0.36.10"
VERSION=$(electron -v)
VERSION=${VERSION:1}

echo "Start packaging for $PLATFORM $ARCH ."

if [ "$PLATFORM" = "win32" ]; then
  ICON="out/image/icon/AoiHana.ico"
  #ICON="" 
elif [ "$PLATFORM" = "darwin" ]; then
  ICON="out/image/icon/AoiHana.icns"
else
  ICON="out/image/icon/icon.png"
fi

# 注意，这里文件名不能用中文，否则windows编译不能加icon，因为rcedit不认识中文。。。
electron-packager . "AoiHana" --platform=$PLATFORM --arch=$ARCH --version=$VERSION --icon=$ICON --overwrite --out=./dist --ignore="(dist|scripts)" --asar=true
#asar表示OSX编译出的app里Contents/Resources/app目录是否打包成一个app.asar文件，防止源码泄露

if [ $? -eq 0 ]; then
  echo -e "Packaging for $PLATFORM $ARCH succeeded.\n"
fi