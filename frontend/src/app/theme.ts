import { Theme, ThemeUIStyleObject } from "theme-ui";

const baseColors = {
  blue: "#1542cd",
  purple: "#745ddf",
  cyan: "#2eb6ea",
  green: "linear-gradient(273.6deg, #527B0B 0.88%, #73A30A 94.96%)",
  yellow: "#d88726",
  red: "#b95151",
  lightRed: "#ff755f",
};

const colors = {
  primary: "transparent"/* baseColors.blue */,
  secondary: baseColors.purple,
  accent: baseColors.cyan,

  success: baseColors.green,
  warning: baseColors.yellow,
  danger: baseColors.red,
  dangerHover: baseColors.lightRed,
  info: baseColors.blue,
  invalid: "#bb6e6e",


  text: "#000000",
  background: "transparent",
  muted: "rgba(109, 187, 185, 0.3);"
};

const buttonBase: ThemeUIStyleObject = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  ":enabled": { cursor: "pointer" }
};

const button: ThemeUIStyleObject = {
  ...buttonBase,

  px: "32px",
  py: "12px",
  mt: "16px",

  color: "#333",
  borderRadius: "10px",

  fontWeight: "bold",

  ":disabled": {
    opacity: 0.5
  }
};

const actionButton = {
  minWidth: "140px",
  opacity: 0.3,
  color: "#fff",

  ":disabled": {
    opacity: 0.5
  }
};

const buttonOutline = (color: string, hoverColor: string): ThemeUIStyleObject => ({
  color,
  borderColor: color,
  background: "none",

  ":enabled:hover": {
    color: "background",
    bg: hoverColor,
    borderColor: hoverColor
  }
});

const iconButton: ThemeUIStyleObject = {
  ...buttonBase,

  padding: 0,
  width: "40px",
  height: "40px",

  background: "none",

  ":disabled": {
    color: "text",
    opacity: 0.25
  }
};

const cardHeadingFontSize = 18.7167;

const cardGapX = [0, 3, 4];
const cardGapY = [3, 3, 4];

const card: ThemeUIStyleObject = {
  position: "relative",
  border: 0,
  borderRadius: [20],
  overflow: "hidden",
};

const infoCard: ThemeUIStyleObject = {
  ...card,

  padding: 3,

  borderColor: "rgba(122,199,240,0.4)",
  background: "linear-gradient(200deg, #d4d9fc, #cae9f9)",

  h2: {
    mb: 2,
    fontSize: cardHeadingFontSize
  }
};

const formBase: ThemeUIStyleObject = {
  display: "block",
  width: "auto",
  flexShrink: 0,
  fontSize: 3,
  color: '#333'
};

const formCell: ThemeUIStyleObject = {
  ...formBase,

  bg: "background",
  border: 1,
  borderColor: "muted",
  borderRadius: 0,
  boxShadow: [1, 2]
};

const overlay: ThemeUIStyleObject = {
  position: "absolute",

  left: 0,
  top: 0,
  width: "100%",
  height: "100%"
};

const modalOverlay: ThemeUIStyleObject = {
  position: "fixed",

  left: 0,
  top: 0,
  width: "100vw",
  height: "100vh"
};

const headerGradient: ThemeUIStyleObject = {
  background: `linear-gradient(90deg, ${colors.background}, ${colors.muted})`
};

const windowGradient: ThemeUIStyleObject = {
  background: "#fff",/* " linear-gradient(180deg, rgba(50,91,93,1) 0%, rgba(14,33,38,1) 73%);" */
}

const theme: Theme = {
  breakpoints: ["48em", "52em", "64em"],

  space: [0, 4, 8, 16, 20, 32, 64, 128, 256, 512],

  fonts: {
    heading: "inherit",
    monospace: "Menlo, monospace",
    SFProDisplay: 'SFProDisplay',
  },

  fontSizes: [12, 14, 16, 20, 24, 32, 36, 48, 64, 96],

  fontWeights: {
    body: 400,
    heading: 600,

    light: 200,
    medium: 500,
    bold: 600
  },

  lineHeights: {
    body: 1.5,
    heading: 1.25
  },

  colors,

  borders: [0, "1px solid", "2px solid"],

  shadows: ["0", "0px 4px 8px rgba(41, 49, 71, 0.1)", "0px 8px 16px rgba(41, 49, 71, 0.1)"],

  text: {
    heading: {
      bg: "transparent",
      textAlign: "center",
    },

    main: {
      fontFamily: 'SFProDisplay',
      fontStyle: 'normal',
      fontSize: '16px',
      lineHeight: '19px',
      textAlign: 'center',
      color: '#000000',
    },
    primary: {
      fontFamily: 'SFProDisplay',
      fontStyle: 'normal',
      fontSize: '14px',
      lineHeight: '17px',
      textAlign: 'center',
      color: '#000000',
    },
    note: {
      fontFamily: 'SFProDisplay',
      fontStyle: 'italic',
      fontWeight: '700',
      fontSize: '12px',
      lineHeight: '14px',
      color: 'rgba(0,0,0,0.7)',
    },
    layoutNavigate: {
      color: "#333"
    },

    address: {
      fontFamily: "monospace",
      fontSize: 1,
    },

    systemStats: {
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: "20px",
      lineHeight: "24px",
    },
    subState: {
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: "14px",
      lineHeight: "17px",
      color: 'rgba(0,0,0,0.5)'
    },
    header: {
      fontFamily: 'SFProDisplay',
      color: 'white',
      fontSize: '14px',
      letterSpacing: '0.1em',
      fontWeight: '700',
      whiteSpace: 'nowrap'
    },
    headerLink: {
      fontFamily: 'SFProDisplay',
      fontSize: '16px',
      letterSpacing: '2px',
      fontWeight: '800',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      color: '#204501',
      textAlign: 'center',
      display: 'block',
    }
  },

  buttons: {
    primary: {
      ...button,

      bg: "primary",
      background: "#6DBBB9",
      color: "#0E2126",
      borderColor: "primary",

      ":enabled:hover": {
      }
    },

    outline: {
      ...button,
      ...buttonOutline("primary", "secondary")
    },

    cancel: {
      ...button,
      ...actionButton,
      bg: "#5e5c5c",
    },

    action: {
      ...button,
      ...actionButton,
      background: "linear-gradient(273.6deg, #527B0B 0.88%, #73A30A 94.96%)",
    },

    danger: {
      ...button,

      bg: "danger",
      borderColor: "danger",

      ":enabled:hover": {
        bg: "dangerHover",
        borderColor: "dangerHover"
      }
    },

    icon: {
      ...iconButton,
      color: "primary",
      ":enabled:hover": { color: "accent" }
    },

    dangerIcon: {
      ...iconButton,
      color: "danger",
      ":enabled:hover": { color: "dangerHover" }
    },

    titleIcon: {
      ...iconButton,
      color: "text",
      ":enabled:hover": { color: "success" }
    }
  },

  grids: {
    nephriteLayout: {
      gridTemplateColumns: "2fr 1fr",
      gridTemplateRows: "repeat(1, 1fr)",
      gridColumnGap: "20px",
      gridRowGap: "0"
    },
    navigationLayout: {
      gridTemplateColumns: "12fr 1fr",
      gridTemplateRows: "1fr",
      gridColumnGap: "20px",
      gridRowGap: "0"
    },
    readablePage: {
      gridAutoRows: "minmax(min-content, max-content)",
      gridTemplateColumns: "repeat(2, 1fr)",
      gridColumnGap: "16px",
      gridRowGap: "16px"
    },
    editablePage: {
      gridTemplateColumns: "repeat(3, 1fr)",
      gridTemplateRows: "repeat(2, 1fr)",
      gridColumnGap: "20px",
      gridRowGap: "0"
    }
  },

  cards: {
    primary: {
      ...card,

      padding: 0,

      borderColor: "none",
      bg: "#ACC874",

      "> h2": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        height: "56px",

        pl: 3,
        py: 2,
        pr: 2,

        bg: "primary",

        fontSize: cardHeadingFontSize
      }
    },

    info: {
      ...infoCard,

      display: ["none", "block"]
    },

    infoPopup: {
      ...infoCard,

      position: "fixed",
      top: 0,
      right: 3,
      left: 3,
      mt: "72px",
      height: "80%",
      overflowY: "scroll"
    },

    tooltip: {
      padding: '16px',
      color: '#000',
      background: 'rgba(255, 255, 255, 0.3)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(30px)',
      borderRadius: '10px',
      fontSize: 1,
      fontWeight: "body",
  }
},

  forms: {
    label: {
      ...formBase
    },

unit: {
      ...formCell,

    textAlign: "center",
      bg: "muted"
},

input: {
      ...formCell,

    flex: 1
},

editor: { },

  },

layout: {
  window: {
      ...windowGradient,
      minHeight: "100vh",
        height: "100%",
          display: "flex",
            flexDirection: "column",
              p: [20],
    },

  block: {
    display: "flex",
      flexDirection: "column",
        justifyContent: "space-between",
          alignItems: "center",
            flex: "100"
  },

  header: {
    display: "flex",
      justifyContent: "space-between",
        alignItems: "stretch",

          position: ["fixed", "relative"],
            width: "100vw",
              top: 0,
                zIndex: 1,

                  px: [2, "12px", "12px", 5],
                    py: [2, "12px", "12px"],

      ...headerGradient,
      boxShadow: [1, "none"]
  },

  footer: {
    display: "flex",
      alignItems: "center",
        justifyContent: "center",

          mt: cardGapY,
            px: 3,
              minHeight: "72px",

                bg: "muted"
  },

  main: {
    width: "100%",
      maxWidth: "912px",
        mx: "auto",
          mt: ["40px", 0],
            mb: ["40px", "40px"],
              px: cardGapX
  },

  columns: {
    display: "flex",
      flexWrap: "wrap",
        justifyItems: "center"
  },

  left: {
    pr: cardGapX,
      width: ["100%", "58%"]
  },

  right: {
    width: ["100%", "42%"]
  },

  actions: {
    justifyContent: "center",
      mt: '40px',

        button: {
    }
  },

  disabledOverlay: {
      ...overlay,

      bg: "rgba(255, 255, 255, 0.5)"
  },

  modalOverlay: {
      ...modalOverlay,

      bg: "rgba(0, 0, 0, 0.8)",

        display: "flex",
          justifyContent: "center",
            alignItems: "center"
  },

  modal: {
    padding: 3,
      width: ["100%", "40em"]
  },

  infoOverlay: {
      ...modalOverlay,

      display: ["block", "none"],

        bg: "rgba(255, 255, 255, 0.8)"
  },

  infoMessage: {
    display: "flex",
      justifyContent: "center",
        m: 3,
          alignItems: "center",
            minWidth: "128px"
  },

  sidenav: {
    display: ["flex", "none"],
      flexDirection: "column",
        p: 0,
          m: 0,
            borderColor: "muted",
              mr: "25vw",
                height: "100%",
      ...headerGradient
  },

  badge: {
    border: 0,
      borderRadius: 3,
        p: 1,
          px: 2,
            backgroundColor: "muted",
              color: "slate",
                fontSize: 1,
                  fontWeight: "body"
  },

  container: {

  }
},

styles: {
  root: {
    fontFamily: "body",
      lineHeight: "body",
        fontWeight: "body",

          height: "100%",

            "#root": {
      height: "100%"
    }
  },

  a: {
    color: "primary",
      ":hover": { color: "accent" },
    textDecoration: "none",
      fontWeight: "bold"
  },
},

links: {
  nav: {
    px: 2,
      py: 1,
        fontWeight: "medium",
          fontSize: 2,
            textTransform: "uppercase",
              letterSpacing: "2px",
                width: ["100%", "auto"],
                  mt: [3, "auto"]
  }
}
};

export default theme;
