// ── Material You Theme Engine ──
// Each theme has a 'light' and 'dark' variant.
// Stores: themeColor (name), darkMode (bool)

const themes = {
  lime: {
    light: {
      '--surface':'#F7F9EF','--surface-container':'#EDF0E3','--surface-container-high':'#E3E6D9',
      '--on-surface':'#1A1C17','--on-surface-variant':'#44483C',
      '--primary':'#C8E158','--on-primary':'#222D00',
      '--secondary':'#3B4862','--on-secondary':'#FFFFFF',
      '--secondary-container':'#DBE2FF','--on-secondary-container':'#001046',
      '--primary-rgb':'200,225,88',
    },
    dark: {
      '--surface':'#12140E','--surface-container':'#1E201A','--surface-container-high':'#2A2C25',
      '--on-surface':'#E3E3D8','--on-surface-variant':'#C6C8B8',
      '--primary':'#C8E158','--on-primary':'#1A1C17',
      '--secondary':'#B0C4FF','--on-secondary':'#0C2460',
      '--secondary-container':'#273B58','--on-secondary-container':'#DBE2FF',
      '--primary-rgb':'200,225,88',
    }
  },
  periwinkle: {
    light: {
      '--surface':'#F8F8FF','--surface-container':'#EEEEf8','--surface-container-high':'#E4E4F0',
      '--on-surface':'#1A1A22','--on-surface-variant':'#44464F',
      '--primary':'#B5C0FF','--on-primary':'#001270',
      '--secondary':'#3A4A7A','--on-secondary':'#FFFFFF',
      '--secondary-container':'#D8E2FF','--on-secondary-container':'#001749',
      '--primary-rgb':'181,192,255',
    },
    dark: {
      '--surface':'#111318','--surface-container':'#1D1F26','--surface-container-high':'#282A31',
      '--on-surface':'#E2E2E9','--on-surface-variant':'#C4C6D0',
      '--primary':'#B5C0FF','--on-primary':'#111318',
      '--secondary':'#A8C7FA','--on-secondary':'#062E6F',
      '--secondary-container':'#3F4759','--on-secondary-container':'#D8E2FF',
      '--primary-rgb':'181,192,255',
    }
  },
  rose: {
    light: {
      '--surface':'#FFF8F6','--surface-container':'#FFEDEA','--surface-container-high':'#FFE0DC',
      '--on-surface':'#231917','--on-surface-variant':'#534340',
      '--primary':'#FFB3AC','--on-primary':'#561E17',
      '--secondary':'#7A4040','--on-secondary':'#FFFFFF',
      '--secondary-container':'#FFDAD6','--on-secondary-container':'#3B0909',
      '--primary-rgb':'255,179,172',
    },
    dark: {
      '--surface':'#1A1110','--surface-container':'#261D1B','--surface-container-high':'#322826',
      '--on-surface':'#F1DFDB','--on-surface-variant':'#D8C2BD',
      '--primary':'#FFB3AC','--on-primary':'#1A1110',
      '--secondary':'#FFB4AB','--on-secondary':'#690005',
      '--secondary-container':'#5D1515','--on-secondary-container':'#FFDAD6',
      '--primary-rgb':'255,179,172',
    }
  },
  mint: {
    light: {
      '--surface':'#F2FBF4','--surface-container':'#E4F4E7','--surface-container-high':'#D6EDD9',
      '--on-surface':'#181D19','--on-surface-variant':'#404943',
      '--primary':'#8EDBA4','--on-primary':'#003919',
      '--secondary':'#1E4A34','--on-secondary':'#FFFFFF',
      '--secondary-container':'#BBECD1','--on-secondary-container':'#002112',
      '--primary-rgb':'142,219,164',
    },
    dark: {
      '--surface':'#0E1510','--surface-container':'#1A211B','--surface-container-high':'#262D27',
      '--on-surface':'#DEE5DC','--on-surface-variant':'#BFC9BF',
      '--primary':'#8EDBA4','--on-primary':'#0E1510',
      '--secondary':'#A0D4B5','--on-secondary':'#003921',
      '--secondary-container':'#1A3B28','--on-secondary-container':'#BBECD1',
      '--primary-rgb':'142,219,164',
    }
  },
  amber: {
    light: {
      '--surface':'#FFF8EB','--surface-container':'#FFF0D6','--surface-container-high':'#FFE7C0',
      '--on-surface':'#201B10','--on-surface-variant':'#4F4539',
      '--primary':'#FFCA28','--on-primary':'#3E2E00',
      '--secondary':'#6D5C2C','--on-secondary':'#FFFFFF',
      '--secondary-container':'#F8DFA5','--on-secondary-container':'#241A00',
      '--primary-rgb':'255,202,40',
    },
    dark: {
      '--surface':'#16130C','--surface-container':'#221F17','--surface-container-high':'#2E2B22',
      '--on-surface':'#EAE1D4','--on-surface-variant':'#D0C5B4',
      '--primary':'#FFCA28','--on-primary':'#16130C',
      '--secondary':'#DDC68A','--on-secondary':'#3E2E00',
      '--secondary-container':'#534416','--on-secondary-container':'#F8DFA5',
      '--primary-rgb':'255,202,40',
    }
  },
  teal: {
    light: {
      '--surface':'#F0FAFA','--surface-container':'#E0F2F2','--surface-container-high':'#D0EAEA',
      '--on-surface':'#151D1D','--on-surface-variant':'#3D4949',
      '--primary':'#4DB6AC','--on-primary':'#003731',
      '--secondary':'#1A5F56','--on-secondary':'#FFFFFF',
      '--secondary-container':'#C1EDE5','--on-secondary-container':'#002019',
      '--primary-rgb':'77,182,172',
    },
    dark: {
      '--surface':'#0D1414','--surface-container':'#192020','--surface-container-high':'#252C2C',
      '--on-surface':'#DEE4E3','--on-surface-variant':'#BFC8C6',
      '--primary':'#4DB6AC','--on-primary':'#0D1414',
      '--secondary':'#A0D5CD','--on-secondary':'#003731',
      '--secondary-container':'#154840','--on-secondary-container':'#C1EDE5',
      '--primary-rgb':'77,182,172',
    }
  },
  violet: {
    light: {
      '--surface':'#FAF6FF','--surface-container':'#F0ECFA','--surface-container-high':'#E6E2F0',
      '--on-surface':'#1C1A22','--on-surface-variant':'#48454E',
      '--primary':'#CE93D8','--on-primary':'#3C0A47',
      '--secondary':'#6750A4','--on-secondary':'#FFFFFF',
      '--secondary-container':'#E8DEF8','--on-secondary-container':'#21005D',
      '--primary-rgb':'206,147,216',
    },
    dark: {
      '--surface':'#141218','--surface-container':'#201E24','--surface-container-high':'#2C2A30',
      '--on-surface':'#E6E1E9','--on-surface-variant':'#CAC4D0',
      '--primary':'#CE93D8','--on-primary':'#141218',
      '--secondary':'#D0BCFF','--on-secondary':'#381E72',
      '--secondary-container':'#4F378B','--on-secondary-container':'#E8DEF8',
      '--primary-rgb':'206,147,216',
    }
  },
  sky: {
    light: {
      '--surface':'#F4F9FF','--surface-container':'#E6F1FC','--surface-container-high':'#D8E9F7',
      '--on-surface':'#171C1F','--on-surface-variant':'#40484D',
      '--primary':'#64B5F6','--on-primary':'#003258',
      '--secondary':'#2B6394','--on-secondary':'#FFFFFF',
      '--secondary-container':'#CDE5FF','--on-secondary-container':'#001D33',
      '--primary-rgb':'100,181,246',
    },
    dark: {
      '--surface':'#0E1316','--surface-container':'#1A1F22','--surface-container-high':'#262B2E',
      '--on-surface':'#DEE3E8','--on-surface-variant':'#BFC8CE',
      '--primary':'#64B5F6','--on-primary':'#0E1316',
      '--secondary':'#90CAF9','--on-secondary':'#003258',
      '--secondary-container':'#0F4A74','--on-secondary-container':'#CDE5FF',
      '--primary-rgb':'100,181,246',
    }
  }
};

// Apply instantly on script load (before DOMContentLoaded) to prevent FOUC
(function applyTheme() {
  chrome.storage.local.get(['themeColor', 'darkMode'], (result) => {
    const name = result.themeColor || 'lime';
    const isDark = result.darkMode === true;
    const mode = isDark ? 'dark' : 'light';
    const vars = (themes[name] && themes[name][mode]) || themes.lime.light;

    const root = document.documentElement;
    for (const [prop, val] of Object.entries(vars)) {
      root.style.setProperty(prop, val);
    }
  });
})();
