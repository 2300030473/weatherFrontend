import React from 'react';
import { FaArrowUp, FaArrowDown, FaArrowRight } from 'react-icons/fa';

function FeelsLikeIndicator({ temp, feelsLike, unit }) {
  let arrow;

  if (feelsLike > temp) {
    arrow = <FaArrowUp color="red" />;
  } else if (feelsLike < temp) {
    arrow = <FaArrowDown color="blue" />;
  } else {
    arrow = <FaArrowRight color="gray" />;
  }

  return (
    <div>
      <p>Feels Like: {feelsLike}°{unit} {arrow}</p>
    </div>
  );
}

export default FeelsLikeIndicator;