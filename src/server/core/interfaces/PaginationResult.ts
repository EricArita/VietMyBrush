/**
 * Interface for pagination result
 */
export interface PaginationResult<T> {
    edges: {
        node: T;
    }[];
    pageInfo: {
        hasNextPage?: boolean;
        endCursor?: string;
        hasPrevPage?: boolean;
        startCursor?: string;
    };
}
