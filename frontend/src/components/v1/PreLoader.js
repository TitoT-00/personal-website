import React, { useState, useEffect } from "react";
import "./preloader.css";
import { preLoaderAnim } from "../../animations";

const PreLoader = () => {
  const [fontIndex, setFontIndex] = useState(0);
  const [isAnimationDone, setIsAnimationDone] = useState(false);

  const fonts = [
    "'Lobster', cursive",
    "'Noto Sans JP', sans-serif",
    "'Crimson Pro', serif",
    "'Montserrat', sans-serif",
    "'Poppins', sans-serif",
    "'Roboto', sans-serif",
    "'Arial Black', sans-serif",
    "'Impact', sans-serif",
    "'Georgia', serif",
    "'Playfair Display', serif"
  ];

  useEffect(() => {
    const fontInterval = setInterval(() => {
      setFontIndex((prevIndex) => (prevIndex + 1) % fonts.length);
    }, 200);

    // Start transition after 3 seconds
    const transitionTimeout = setTimeout(() => {
      setIsAnimationDone(true);
      preLoaderAnim();
    }, 1000);

    return () => {
      clearInterval(fontInterval);
      clearTimeout(transitionTimeout);
    };
  }, [fonts.length]);

  return (
    <div className={`preloader ${isAnimationDone ? 'split-active' : ''}`}>
      <div className="split-half left">
        <span style={{ fontFamily: fonts[fontIndex] }}>Tito</span>
      </div>
      <div className="split-half right">
        <span style={{ fontFamily: fonts[fontIndex] }}>Thomas</span>
      </div>
    </div>
  );
};

export default PreLoader;
