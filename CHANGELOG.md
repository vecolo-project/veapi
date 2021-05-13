# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2021-05-06
### Added
- mariaDB

### Changed
- Config

### Removed
- markdown files

## [1.0.0] - 2021-05-08
in branch cleanning boilerplate
### Added
- mariaDB config
- endPoint Hello World on '/api'
- inquired

### Changed
- userService use of Repository instead of MongodbRepository
- database/seeds and database/factory the transition from MongoDB to MariaDB was destructive here.
we should probably rething this part of the project later
- config : use of full db description insteed of db_url and split it between env
- seed (by cli) tools

### Removed
- markdown
- Unused Routes and models (Company and JobApplication)
- commander