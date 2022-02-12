import React, { useEffect, useState } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import wordsToNumbers from "words-to-numbers";
import NewsCard from "./components/NewsCard/NewsCard";
import useStyles from "./styles.js";
import { Typography } from "@material-ui/core";
const alanKey = process.env.REACT_APP_ALAN_KEY;
function App() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(-1);
  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles, number }) => {
        if (command === "newHeadlines") {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === "highlight") {
          setActiveArticle((prev) => prev + 1);
        } else if (command === "open") {
          const parsedNumbers =
            number.length > 2
              ? wordsToNumbers(number, { fuzzy: true })
              : number;
          const article = articles[parsedNumbers - 1];
          if (parsedNumbers > 20) {
            alanBtn().playText("Please try that again");
          } else if (article) {
            window.open(article.url, "_blank");
            alanBtn().playText("Opening...");
          }
        }
      },
    });
  }, []);
  console.log(newsArticles);
  const classes = useStyles();
  return (
    <div>
      <div className={classes.logoContainer}>
        <img
          src="https://www.alanai.co/images/alanai-logo.png"
          className={classes.logo}
        />
        <Typography variant="h3" className="head">
          Alan AI
        </Typography>
      </div>
      <NewsCard articles={newsArticles} activeArticle={activeArticle} />
    </div>
  );
}

export default App;
