export type Book = {
  title: string;
  price: string;
  description: string;
};

export function createBook(book: Book, books: Array<Book>) {
  books = [...books, book];
  return books;
}
