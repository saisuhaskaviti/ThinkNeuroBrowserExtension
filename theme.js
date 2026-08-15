// Material You Theme Definitions
// Structured as CSS variable maps per theme name.
// Each theme is a LIGHT Material 3 scheme inspired by Android 17.

const themes = {
  lime: {
    '--surface':               '#F7F9EF',
    '--surface-container':     '#EDF0E3',
    '--surface-container-high':'#E3E6D9',
    '--on-surface':            '#1A1C17',
    '--on-surface-variant':    '#44483C',
    '--primary':               '#C8E158',   // bright lime blob
    '--on-primary':            '#222D00',
    '--primary-container':     '#D7F069',
    '--on-primary-container':  '#1E2B00',
    '--secondary':             '#3B4862',   // deep blue/purple action btn
    '--on-secondary':          '#FFFFFF',
    '--secondary-container':   '#DBE2FF',
    '--on-secondary-container':'#001046',
    '--primary-rgb':           '200, 225, 88',
  },
  periwinkle: {
    '--surface':               '#F8F8FF',
    '--surface-container':     '#EEEEf8',
    '--surface-container-high':'#E4E4F0',
    '--on-surface':            '#1A1A22',
    '--on-surface-variant':    '#44464F',
    '--primary':               '#B5C0FF',
    '--on-primary':            '#001270',
    '--primary-container':     '#DEE2FF',
    '--on-primary-container':  '#000E60',
    '--secondary':             '#3A4A7A',
    '--on-secondary':          '#FFFFFF',
    '--secondary-container':   '#D8E2FF',
    '--on-secondary-container':'#001749',
    '--primary-rgb':           '181, 192, 255',
  },
  rose: {
    '--surface':               '#FFF8F6',
    '--surface-container':     '#FFEDEA',
    '--surface-container-high':'#FFE0DC',
    '--on-surface':            '#231917',
    '--on-surface-variant':    '#534340',
    '--primary':               '#FFB3AC',
    '--on-primary':            '#561E17',
    '--primary-container':     '#FFDAD6',
    '--on-primary-container':  '#3B0909',
    '--secondary':             '#7A4040',
    '--on-secondary':          '#FFFFFF',
    '--secondary-container':   '#FFDAD6',
    '--on-secondary-container':'#3B0909',
    '--primary-rgb':           '255, 179, 172',
  },
  mint: {
    '--surface':               '#F2FBF4',
    '--surface-container':     '#E4F4E7',
    '--surface-container-high':'#D6EDD9',
    '--on-surface':            '#181D19',
    '--on-surface-variant':    '#404943',
    '--primary':               '#8EDBA4',
    '--on-primary':            '#003919',
    '--primary-container':     '#AFEEC4',
    '--on-primary-container':  '#002D12',
    '--secondary':             '#1E4A34',
    '--on-secondary':          '#FFFFFF',
    '--secondary-container':   '#BBECD1',
    '--on-secondary-container':'#002112',
    '--primary-rgb':           '142, 219, 164',
  }
};

// Apply immediately on script load (before DOMContentLoaded) to prevent FOUC
(function applyTheme() {
  chrome.storage.local.get(['themeColor'], (result) => {
    const name = result.themeColor || 'lime';
    const theme = themes[name] || themes.lime;
    const root = document.documentElement;
    for (const [prop, val] of Object.entries(theme)) {
      root.style.setProperty(prop, val);
    }
  });
})();
