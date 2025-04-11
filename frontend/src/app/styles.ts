import { css } from '@linaria/core';

css`
  :global() {
    :root {
      --color-purple: #da68f5;
      --color-red: #f25f5b;
      --color-red-expiring: #ff436a;
      --color-yellow: #f4ce4a;
      --color-green: linear-gradient(273.6deg, #527B0B 0.88%, #73A30A 94.96%);
      --color-blue: #0bccf7;
      --color-dark-blue: #042548;
      --color-darkest-blue: #032e49;
      --color-white: #ffffff;
      --color-gray: #8196a4;
      --color-white: white;
      --color-disconnect: #ff746b;
      --color-vote-red: #de3155;
      --color-popup: rgba(13, 77, 118);
      --color-select: #184469;
      --color-transparent: rgba(32, 69, 1, 0.05);

      --color-disabled: #8da1ad;

      --color-usdt-from: rgba(80, 175, 149, .3);
      --color-eth-from: rgba(94, 123, 242, .3);
      --color-wbtc-from: rgba(247, 147, 26, .3);
      --color-dai-from: rgba(245, 172, 55, .3);
    }

    @font-face {
      font-family: 'ProximaNova';
      src: url('/assets/fonts/ProximaNova-Regular.ttf');
      font-weight: 400;
      font-style: normal;
    }

    @font-face {
      font-family: 'ProximaNova';
      src: url('/assets/fonts/ProximaNova-RegularIt.ttf');
      font-weight: 400;
      font-style: italic;
    }

    @font-face {
      font-family: 'ProximaNova';
      src: url('/assets/fonts/ProximaNova-Semibold.ttf');
      font-weight: 600;
      font-style: normal;
    }

    @font-face {
      font-family: 'ProximaNova';
      src: url('/assets/fonts/ProximaNova-Bold.ttf');
      font-weight: 700;
      font-style: normal;
    }

    @font-face {
      font-family: 'SFProDisplay';
      src: url('./assets/fonts/SF-Pro-Display-Regular.otf');
      font-weight: 400;
      font-style: normal;
    }

    @font-face {
      font-family: 'SFProDisplay';
      src: url('./assets/fonts/SF-Pro-Display-RegularItalic.otf');
      font-weight: 400;
      font-style: italic;
    }

    @font-face {
      font-family: 'SFProDisplay';
      src: url('./assets/fonts/SF-Pro-Display-Bold.otf');
      font-weight: 700;
      font-style: normal;
    }



    * {
      box-sizing: border-box;
      outline: none;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      min-width: 860px;
    }

    #root {
      display: inline;
    }

    html * {
      font-family: 'SFProDisplay', sans-serif;
    }

    body {
      font-size: 14px;
      color: white;
    }    

    p {
      margin: 0;
    }

    h1,h2 {
      margin: 0;
    }

    ul,
    ol {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    tr, th, table {
      border: none;
      border-spacing: 0;
      padding: 0;
      margin: 0;
      border-collapse: inherit;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    ::-webkit-scrollbar {
        width: 11px;
        height: 10px;
      }
      
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(255, 255, 255, .2);
      border: 3px solid rgba(0, 0, 0, 0);
      background-clip: padding-box;
    }
    
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    
    ::-webkit-scrollbar-button {
      display: none;
    }

    .container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-left: 22px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 12px;
  width: 12px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.3);
  margin-top: 2px;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color:  #50780A;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 3px;
  top: 0;
  width: 3px;
  height: 7px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
}
`;





