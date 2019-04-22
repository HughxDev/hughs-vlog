const injectSharedStyles = function injectSharedStyles( css ) {
  css = css.replace(
    /@apply\s+--sr-only;/,
    `position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            overflow: hidden;
            clip: rect(0,0,0,0);
            white-space: nowrap;
            clip-path: inset(50%);
            border: 0;`
  );

  return css;
};

export default injectSharedStyles;
