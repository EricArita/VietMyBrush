export interface Hook {
  before?: {
    all?: ((context: any) => Promise<void>)[],
    find?: ((context: any) => Promise<void>)[],
    get?: ((context: any) => Promise<void>)[],
    create?: ((context: any) => Promise<void>)[],
    update?: ((context: any) => Promise<void>)[],
    patch?: ((context: any) => Promise<void>)[],
    remove?: ((context: any) => Promise<void>)[],
  };
  after?: {
    all?: ((context: any) => Promise<void>)[],
    find?: ((context: any) => Promise<void>)[],
    get?: ((context: any) => Promise<void>)[],
    create?: ((context: any) => Promise<void>)[],
    update?: ((context: any) => Promise<void>)[],
    patch?: ((context: any) => Promise<void>)[],
    remove?: ((context: any) => Promise<void>)[],
  };
  error?: {
    all?: ((context: any) => Promise<void>)[],
    find?: ((context: any) => Promise<void>)[],
    get?: ((context: any) => Promise<void>)[],
    create?: ((context: any) => Promise<void>)[],
    update?: ((context: any) => Promise<void>)[],
    patch?: ((context: any) => Promise<void>)[],
    remove?: ((context: any) => Promise<void>)[],
  };
}
