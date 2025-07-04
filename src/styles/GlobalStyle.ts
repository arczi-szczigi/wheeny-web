import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* Import czcionki Roboto z Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: 'Roboto', sans-serif;
    background-color: #ffffff;
    color: #171717;
  }

  input, button, textarea, select {
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyle;
