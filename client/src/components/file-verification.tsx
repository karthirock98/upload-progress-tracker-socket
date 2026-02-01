import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import ten from "../assets/Time management.lottie";
import twenty from "../assets/Ninja.lottie";
import thirty from "../assets/noodle.lottie";
import fourty from "../assets/Computer coding icon Lottie JSON animation.lottie";
import fifty from "../assets/Loading Files.lottie";
import hundred from "../assets/hundred.lottie";

type Props = {
  step: string;
  percent: number;
};

const FileVerificationCard: React.FC<Props> = ({ step, percent }) => {
  const animationMap: Record<number, string> = {
    10: ten,
    20: twenty,
    30: thirty,
    40: fourty,
    50: fifty,
    60: fifty,
    70: fourty,
    80: twenty,
    90: ten,
    100: hundred,
  };

  const currentAnimation = animationMap[percent] || hundred;

  return (
    <div className="verify-card">
      <DotLottieReact src={currentAnimation} autoplay loop />
      <h5 className="verify-step">{step}</h5>
      <h6 className="verify-percent">{percent}%</h6>
    </div>
  );
};

export default FileVerificationCard;
