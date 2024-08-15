import LogLevel from "../enums/LogLevel";

const customLevels = {
  levels: {
    [LogLevel.ERROR]: 0,
    [LogLevel.WARN]: 1,
    [LogLevel.INFO]: 2,
    [LogLevel.HTTP]: 3,
    [LogLevel.VERBOSE]: 4,
    [LogLevel.DEBUG]: 5,
    [LogLevel.SILLY]: 6,
  },
  colors: {
    [LogLevel.ERROR]: "red",
    [LogLevel.WARN]: "yellow",
    [LogLevel.INFO]: "green",
    [LogLevel.HTTP]: "magenta",
    [LogLevel.VERBOSE]: "cyan",
    [LogLevel.DEBUG]: "blue",
    [LogLevel.SILLY]: "grey",
  },
};

export default customLevels;
