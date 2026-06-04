import React from 'react';

// Swizzled ReactLiveScope — everything in this object is in scope inside
// ```jsx live code blocks. Spreading `React` exposes the hooks (useState,
// useEffect, useRef, useMemo, useCallback, useReducer, …) and Fragment as
// bare globals, so live examples can be written the way they'd appear in a
// real file (`const [x, setX] = useState(0)`), not `React.useState`.
const ReactLiveScope = {
  React,
  ...React,
};

export default ReactLiveScope;
