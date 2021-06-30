export class Book {
    id: number|null = null;
    title: string|null = null;
    resume: string|null = null;
    pagesCount: number|null = null;
    publishedAt: Date|null = null;
    isbn: string|null = null;
    inSell: boolean|null = null;
    author: Author|null = null;
}

export class Author {
    id: number =0;
    name: string = '';
    birthDate: Date = new Date();
}
