/* eslint-disable import/prefer-default-export */
export const theme = {
  layer: {
    border: {
      radius: 'medium'
    }
  },    
  formField: {
    extend: () => `
      border-bottom: 1px solid #99aabb;
      padding-bottom: 20px;

      color: #99aabb;
      &:focus {
        box-shadow: none;
        border-color: initial;
        background: #ffffff;
        color: #000000;
      }
    `,
  },
  textArea: {
    extend: () => `
      background: #242c34;
      color: #99aabb;  
      &:focus {
        box-shadow: none;
        border-color: initial;
        background: #ffffff;
        color: #000000;
      }
    `,
  },
  textInput: {
    extend: () => `
      background: #242c34;
      color: #99aabb;  
      &:focus {
        box-shadow: none;
        border-color: initial;
        background: #ffffff;
        color: #000000;
      }
    `,
    placeholder: {
      extend: () => `
        width: 100%;
        color: #99aabb;
      `,
    },
    suggestions: {
      extend: () => `
        background: #ffffff;
        color: #3d3522;
        li {
          border-bottom: 2px solid rgba(0, 0, 0, 0.2);
        }
        li:last-child{
          border: 0;      
        }    
      `,
    },
  },
  global: {
    colors: {
      brand: '#1E212D',
      primary: '#111111',
      secondary: '#B68973',
      secondary_variant: '#EABF9F',
      background_dark_1: '#14181c',
      background_dark_2: '#242c34',
      background_foo: '#678',
      background_light_1: '#9ab',
      background_light_2: '#bcd',
      background: "linear-gradient(#2c3440, #14181c)",
      text: 'white',
      control: "#9ab",
      text_dark_1: '#9ab',
    },    
    focus: {
      border: {
        color: 'none'
      }
    },
    notification: {
      time: 2000,
    },
    font: {
      size: '15px',
      family: 'Arial',
    },
    input: {
      weight: 400,
    }, 
    elevation: {
      dark: {
        medium: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      },
      light: {
        medium: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      },
    },       
  },
  button: {
    extend: () => `
      background: #242c34;
      color: #9ab;
      border-width: 1px;      
      &:hover {
        background: #678;
        color: white;
        border-width: 1px;
      }  
    `,
  },
  anchor: {
    hover: {
      textDecoration: 'none',
    }
  },
  tip: {
    content: { 
      background: "background_foo", 
      elevation: "none", 
      margin: "xsmall", 
      pad: { vertical: "xsmall", horizontal: "small" }, 
      round: "small"
    },
    drop: {
      background: "none",
      elevation: "none",
      margin: "none"
    }
  },
  text: {
    medium: {
      size: '15px',
    },
    small: {
      size: '12px',
    }
  },  
  checkBox: {
    size: '17px',
    check: {
      radius: '4px',
      thickness: '2px',
    },
  },
  notification: {
    title: {
      color: 'black',
    },
    message: {
      color: 'black',
    },
    toast: {
      time: 3000,
    },
    close: {
      color: 'white',
    },
  },
  radioButton: {
    border: {
      color: "background_foo",
      width: "2px"
    },
    hover: {
      border: {
        color: "text_dark_1"
      }
    }
  },
  select: {
    options: {
      text: {
        margin: 'none',
        size: 'small'
      }
    }
  }
};
