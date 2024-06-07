import { NextResponse} from 'next/server';

const url = 'https://fear-and-greed-index.p.rapidapi.com/v1/fgi';
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': '2af26f4245msh16ed231a749e96fp196140jsn816f5f0c8e15',
    'x-rapidapi-host': 'fear-and-greed-index.p.rapidapi.com',
  },
};

export async function GET() {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
	return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Fear and Greed Index' }, { status: 500 });
  }
}
