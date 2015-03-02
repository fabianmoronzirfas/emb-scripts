#!/bin/bash

BASEDIR="$( dirname "$0" )"
cd "$BASEDIR"
echo "This is where we are :"
pwd
echo "Installing InDesign 10.0 Find-Change Queries 'GREP'"
path=~/Library/Preferences/Adobe\ InDesign/Version\ 10.0/de_DE/Find-Change\ Queries/GREP/
cd $path $$ f
#cp _fcqueries/mpo-grep/*.xml ~/Library/Preferences/Adobe\ InDesign/Version\ 10.0/de_DE/Find-Change\ Queries/GREP/

echo "we are done. Bye Bye"