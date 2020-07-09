export interface Storage {
    saveFileStream: (stream: NodeJS.ReadableStream, filePath: string) => Promise<void>;
}
