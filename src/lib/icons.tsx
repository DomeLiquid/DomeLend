'use client';

export type IconProps = {
  size?: number;
  className?: string;
};

export const IconInfiniteLoader = ({ size = 24, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300 150"
    width={size}
    height={size}
    className={className}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="20"
      strokeLinecap="round"
      strokeDasharray="300 385"
      strokeDashoffset="0"
      d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
    >
      <animate
        attributeName="stroke-dashoffset"
        calcMode="spline"
        dur="2"
        values="685;-685"
        keySplines="0 0 1 1"
        repeatCount="indefinite"
      ></animate>
    </path>
  </svg>
);

export const IconMixin = ({ size = 24, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fill="#1A73E8"
      d="m26.405 7.151l-3.63 1.61a.67.67 0 0 0-.35.59v12.98a.66.66 0 0 0 .36.59l3.63 1.57a.338.338 0 0 0 .5-.3V7.451a.35.35 0 0 0-.51-.3M9.02 8.741l-3.52-1.6a.338.338 0 0 0-.5.3v16.74a.341.341 0 0 0 .52.29l3.54-1.87a.67.67 0 0 0 .32-.57v-12.7a.7.7 0 0 0-.36-.59m11.04 4.43l-3.79-2.17a.67.67 0 0 0-.67 0l-3.86 2.15a.68.68 0 0 0-.34.59v4.4c0 .243.13.468.34.59l3.86 2.22c.207.12.463.12.67 0l3.79-2.2a.68.68 0 0 0 .34-.59v-4.4a.67.67 0 0 0-.34-.59"
    />
  </svg>
);