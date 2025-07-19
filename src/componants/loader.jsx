import React, { useState, useEffect } from 'react';

function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // hide loader after 0.1 seconds (100ms)
    }, 100);

    return () => clearTimeout(timer); // cleanup timer on unmount
  }, []);

  if (!loading) return null; // hide loader completely when loading is false

  return (
    <div id="global-loader">
      <div className="whirly-loader"></div>
    </div>
  );
}

export default Loader;
