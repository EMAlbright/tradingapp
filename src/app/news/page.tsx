import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./news.css";

interface Article {
    source: {
        id: string | null,
        name: string
    },
    author: string,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,
    content: string
}


const NewsWheel = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news');
        setArticles(response.data.articles);
      } catch (error) {
        setError('Failed to fetch Fear and Greed Index');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    //every 10 sec rotate
    const interval = setInterval(() => {
        setCurrentArticleIndex((prevIndex) => (prevIndex+1) % articles.length)
    }, 90000);

    return () => clearInterval(interval); 
  }, [articles.length]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  function removeLetterAndAfter(str: string, letter: string) {
    return str.split(letter)[0];
  }

  const currentArticle = articles[currentArticleIndex];

  const getNextArticleIndex = () => {
    let newIndex = currentArticleIndex + 1;
    while (newIndex < articles.length) {
      if (!articles[newIndex].url.includes('https://removed.com')) {
        return newIndex;
      }
      newIndex++;
    }
    return 0; 
  };

  const nextArticleIndex = getNextArticleIndex();

  return (
    <div className="news-wheel text-white">
         {articles.length > 0 && (
        <div className="news-item">
          <a href={articles[nextArticleIndex].url} target="_blank" rel="noopener noreferrer">
            <h3 className='title'>{articles[nextArticleIndex].title}</h3>
            <img src={articles[nextArticleIndex].urlToImage} alt={articles[nextArticleIndex].title} />
            <p>{articles[nextArticleIndex].description}</p>
            <p className='text-left text-sm'>{removeLetterAndAfter(articles[nextArticleIndex].publishedAt, "T")}</p>
          </a>
        </div>
      )}

    </div>
  );
};

export default NewsWheel;