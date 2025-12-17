import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type PageDocument = HydratedDocument<Page>;
export declare class Page {
    title: string;
    slug: string;
    metaDescription: string;
    content: any[];
    gjsAssets: any[];
    type: string;
    gjsComponents: any[];
    gjsStyles: any[];
    status: string;
    viewCount: number;
    publishedAt: Date;
    folder: MongooseSchema.Types.ObjectId;
    gjsCss: string;
    gjsHtml: string;
}
export declare const PageSchema: MongooseSchema<Page, import("mongoose").Model<Page, any, any, any, import("mongoose").Document<unknown, any, Page, any, import("mongoose").DefaultSchemaOptions> & Page & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, Page>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Page, import("mongoose").Document<unknown, {}, Page, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metaDescription?: import("mongoose").SchemaDefinitionProperty<string, Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<any[], Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gjsAssets?: import("mongoose").SchemaDefinitionProperty<any[], Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gjsComponents?: import("mongoose").SchemaDefinitionProperty<any[], Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gjsStyles?: import("mongoose").SchemaDefinitionProperty<any[], Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    viewCount?: import("mongoose").SchemaDefinitionProperty<number, Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    publishedAt?: import("mongoose").SchemaDefinitionProperty<Date, Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    folder?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gjsCss?: import("mongoose").SchemaDefinitionProperty<string, Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gjsHtml?: import("mongoose").SchemaDefinitionProperty<string, Page, import("mongoose").Document<unknown, {}, Page, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Page & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Page>;
