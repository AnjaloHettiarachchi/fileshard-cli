fileshard-cli
=============

Desktop CLI Client for the [FileShard](https://github.com/AnjaloHettiarachchi/FileShard) platform.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![License](https://img.shields.io/npm/l/fileshard-cli.svg)](https://github.com/AnjaloHettiarachchi/fileshard-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g fileshard-cli
$ fileshard COMMAND
running command...
$ fileshard (-v|--version|version)
fileshard-cli/0.1.0 darwin-x64 node-v14.16.1
$ fileshard --help [COMMAND]
USAGE
  $ fileshard COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fileshard connect`](#fileshard-connect)
* [`fileshard download`](#fileshard-download)
* [`fileshard help [COMMAND]`](#fileshard-help-command)
* [`fileshard list`](#fileshard-list)
* [`fileshard upload [FILE]`](#fileshard-upload-file)

## `fileshard connect`

Connect with the FileShard service.

```
USAGE
  $ fileshard connect

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ fileshard connect
```

_See code: [src/commands/connect.ts](https://github.com/AnjaloHettiarachchi/fileshard-cli/blob/v0.1.0/src/commands/connect.ts)_

## `fileshard download`

Download a specific file from FileShard.

```
USAGE
  $ fileshard download

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ fileshard download -n MyZipFile.zip
```

_See code: [src/commands/download.ts](https://github.com/AnjaloHettiarachchi/fileshard-cli/blob/v0.1.0/src/commands/download.ts)_

## `fileshard help [COMMAND]`

display help for fileshard

```
USAGE
  $ fileshard help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `fileshard list`

List uploaded files to the FileShard.

```
USAGE
  $ fileshard list

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ fileshard list
```

_See code: [src/commands/list.ts](https://github.com/AnjaloHettiarachchi/fileshard-cli/blob/v0.1.0/src/commands/list.ts)_

## `fileshard upload [FILE]`

Upload a file to FileShard.

```
USAGE
  $ fileshard upload [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/upload.ts](https://github.com/AnjaloHettiarachchi/fileshard-cli/blob/v0.1.0/src/commands/upload.ts)_
<!-- commandsstop -->
