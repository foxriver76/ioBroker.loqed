![Logo](admin/loqed.png)
# ioBroker.loqed

[![NPM version](https://img.shields.io/npm/v/iobroker.loqed.svg)](https://www.npmjs.com/package/iobroker.loqed)
[![Downloads](https://img.shields.io/npm/dm/iobroker.loqed.svg)](https://www.npmjs.com/package/iobroker.loqed)
![Number of Installations](https://iobroker.live/badges/loqed-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/loqed-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.loqed.png?downloads=true)](https://nodei.co/npm/iobroker.loqed/)

**Tests:** ![Test and Release](https://github.com/foxriver76/ioBroker.loqed/workflows/Test%20and%20Release/badge.svg)

## loqed adapter for ioBroker

Control LOQED smart locks

Control the LOQED smart lock with state `lockMotor.goToPosition`:
- `NIGHT_LOCK` to lock
- `DAY_LOCK` to unlock
- `OPEN` to release the door

Get the current position from state `lockMotor.currentPosition`.

There are additional states to use the lock with HomeKit. In case of your door has a lever outside and this is configured in your lock they may work different to the states above, because the LOQED API sends the OPEN feedback instead of DAY_LOCK if the LOQED app is used to unlock.

To use the lock with HomeKit (yahka) add a new device of category "door lock", add the service "LockMechanism" to this device and configure the states as follows:
`LockCurrentState` => `loqed.0.lockMotor.homekitLockCurrentState`
`LockTargetState` => `loqed.0.lockMotor.homekitLockTargetState`

Then add the service "Battery" to this device and configure the states as follows:
`BatteryLevel` => `loqed.0.lockStatus.batteryPercentage`

Finally the lock can be controlled by setting true or false to state `lockMotor.simpleLockUnlock`.
- `false` to lock
- `true` to unlock

Please note that this state doesn't get updated directly if you control the lock with one of the other states to avoid misunderstandings. If the lock is locked and get's unlocked with one of the other control states the state `lockMotor.simpleLockUnlock` will not come true until the lock reports to be open.

## Changelog
<!--
    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**
-->
## **WORK IN PROGRESS**

* (Standarduser) Added synchronous states for HomeKit (yahka). Please note that HomeKit doesn't support the open-command, just lock and unlock (=secure/unsecure)
* (Standarduser) Added simple binary state to lock or unlock (open-command not supported)
* (Standarduser) Added some explanations to readme

### 0.3.1 (2023-08-17)
* (foxriver76) updated the library to fix unknown events (closes #7)

### 0.3.0 (2023-08-09)
* (foxriver76) added state for local key id (closes #6)

### 0.2.3 (2023-08-07)
* (foxriver76) updated the library to fix unknown events (closes #5)

### 0.2.2 (2023-07-30)
* (foxriver76) updated the library to fix unknown events

### 0.2.1 (2022-09-10)
* (foxriver76) ensure library is updated

### 0.2.0 (2022-09-09)
* (foxriver76) connection handling implemented
* (foxriver76) some bugs fixed
* (foxriver76) battery level updates implemented

### 0.1.2 (2022-09-09)
* (foxriver76) io-package optimizations

### 0.1.1 (2022-09-09)
* (foxriver76) initial release

## License
MIT License

Copyright (c) 2023 Moritz Heusinger <moritz.heusinger@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
