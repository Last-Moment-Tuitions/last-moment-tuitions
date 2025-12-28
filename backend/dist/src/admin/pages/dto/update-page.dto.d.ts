export declare class UpdatePageDto {
    title?: string;
    slug?: string;
    metaDescription?: string;
    gjsComponents?: any[];
    gjsStyles?: any[];
    gjsHtml?: string;
    gjsCss?: string;
    type?: 'page' | 'template';
    status?: string;
    folder?: string;
}
