(() => {
  if (!document.querySelector('link[data-zloon-typography]')) {
    const typography = document.createElement('link');
    typography.rel = 'stylesheet';
    typography.href = 'zloon-typography.css?v=20260831';
    typography.dataset.zloonTypography = 'true';
    document.head.appendChild(typography);
  }
  if (!document.querySelector('link[data-zloon-experience]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'experience.css?v=20260855';
    css.dataset.zloonExperience = 'true';
    document.head.appendChild(css);
    const script = document.createElement('script');
    script.src = 'experience.js?v=20260856';
    script.dataset.zloonExperience = 'true';
    document.head.appendChild(script);
  }
  if (!document.querySelector('link[data-zloon-footer]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'footer-details.css';
    css.dataset.zloonFooter = 'true';
    document.head.appendChild(css);
    const large = document.createElement('link');
    large.rel = 'stylesheet';
    large.href = 'footer-large.css';
    large.dataset.zloonFooter = 'true';
    document.head.appendChild(large);
  }
  if (!document.querySelector('script[data-zloon-footer]')) {
    const script = document.createElement('script');
    script.src = 'footer.js';
    script.dataset.zloonFooter = 'true';
    document.head.appendChild(script);
  }
  if (!document.querySelector('link[data-zloon-tools]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'site-tools.css?v=20260844';
    css.dataset.zloonTools = 'true';
    document.head.appendChild(css);
    const toolsFix = document.createElement('link');
    toolsFix.rel = 'stylesheet';
    toolsFix.href = 'site-tools-fix.css?v=20260844';
    toolsFix.dataset.zloonTools = 'true';
    document.head.appendChild(toolsFix);
    const headerTools = document.createElement('link');
    headerTools.rel = 'stylesheet';
    headerTools.href = 'header-tools.css?v=20260845';
    headerTools.dataset.zloonTools = 'true';
    document.head.appendChild(headerTools);
    const headerToolsFix = document.createElement('link');
    headerToolsFix.rel = 'stylesheet';
    headerToolsFix.href = 'header-tools-fix.css?v=20260845';
    headerToolsFix.dataset.zloonTools = 'true';
    document.head.appendChild(headerToolsFix);
    const copyPolish = document.createElement('script');
    copyPolish.src = 'copy-polish.js?v=20260846';
    copyPolish.dataset.zloonTools = 'true';
    document.head.appendChild(copyPolish);
    const tools = document.createElement('script');
    tools.src = 'site-tools.js?v=20260844';
    tools.dataset.zloonTools = 'true';
    document.head.appendChild(tools);
  }
})();
