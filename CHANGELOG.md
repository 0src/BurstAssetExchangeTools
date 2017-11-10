# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
This section is used to see what changes you might expect in upcoming releases.
At release time, it will be sent to the release version number.

## [1.0.3] - 2017-11-10
### Changed
- Solved issue with decimals for some assets.

## [1.0.2] - 2017-10-26
### Added
- You can now change the server you use.
- History files are created when the payout is sent.
- Type declaration for 90% of the code.
- Added CHANGELOG.md
- Added tsconfig.json
- fs-path package for npm to handle database.js

### Changed
- Deferred payouts are now stored in the same folder as the app (allowing full portable support).
- Updated folder structure.
- Cleaned up the source.
- Replaced "electron-json-storage" with my own and simpler database.js to handle the database files.

### Removed
- Installer, now only providing the folder in zip.
- electron-json-storage and es6-promise package is not needed anymore.
- Unnecessary files for distribution.
- Changelog info on README.md

## [1.0.1] - 2017-10-24
### Added
- Now you can change the server you want to connect to.
- Auto Scroll while sending the payout.
- Added initial code for history (not working).

### Changed
- Increased the speed it send the payout.
- Renamed "Postponed" to "Deferred".
- Changed installer to use Squirrel instead of MSI.
- Cleaned source.

## [1.0.0] - 2017-10-24
### Added
- Initial Release