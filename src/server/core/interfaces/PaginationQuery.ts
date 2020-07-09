/**
 * Interface for pagination query
 */
export interface PaginationQuery {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
    orderBy?: string; // createdAt_ASC
    fields: string[]; // fields to return
}
