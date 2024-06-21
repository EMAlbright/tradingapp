const url = 'https://twelve-data1.p.rapidapi.com/technical_indicators';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '2af26f4245msh16ed231a749e96fp196140jsn816f5f0c8e15',
		'x-rapidapi-host': 'twelve-data1.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}