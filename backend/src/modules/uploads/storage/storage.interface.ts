// Storage provider interface
export interface StorageProvider {
    getPresignedUrl(folder: string, filename: string, contentType: string): Promise<{ uploadUrl: string; key: string; publicUrl: string }>;
    delete(key: string): Promise<void>;
    list(folder?: string): Promise<Array<{ url: string; key: string; lastModified: Date; size: number }>>;
    getBuffer?(key: string): Promise<Buffer>;
}
