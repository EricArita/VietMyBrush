import { LogLevel } from 'bunyan';
export interface FileLoggerStream {
  type: 'rotating-file';
  path: string;
  period: string;
  count: number;
}
export interface ConsoleLoggerStream {
  stream: NodeJS.WriteStream;
  level: LogLevel;
}
export interface LoggerConfiguration {
  streams: (FileLoggerStream | ConsoleLoggerStream)[];
}
