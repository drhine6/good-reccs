import { PUBLIC_HARDCOVER_API_URL } from '$env/static/public';
import { HARDCOVER_API_KEY } from '$env/static/private';

const fetchGraphQL = async (query: string, variables = {}) => {
	const response = await fetch(PUBLIC_HARDCOVER_API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${HARDCOVER_API_KEY}`
		},
		body: JSON.stringify({ query, variables })
	});

	if (!response.ok) throw new Error('Failed to fetch from Hardcover API');
	const json = await response.json();
	if (json.errors) {
		console.error(json.errors);
		throw new Error('Failed to fetch from Hardcover API');
	}
	return json.data;
};

export const load = async () => {
	// Step 1: Get the user's book IDs
	const userBooksQuery = `
    query {
      me {        
        user_books {
          book_id
          read_count
        }
      }
    }
  `;

	const userData = await fetchGraphQL(userBooksQuery);
	const books = userData?.me[0].user_books.filter(
		(book: { read_count: number }) => book.read_count > 0
	);
	const bookIds = books?.map((book: { book_id: string }) => book.book_id) || [];

	if (bookIds.length === 0) return { books: [] };

	// Step 2: Get detailed info about those books
	const booksQuery = `
    query GetBooksByIds($ids: [Int!]!) {
      books(where: { id: { _in: $ids } }) {
        id
        title       
        image {
          url
        }        
      }
    }
  `;

	const booksData = await fetchGraphQL(booksQuery, { ids: bookIds });

	return { books: booksData.books };
};
