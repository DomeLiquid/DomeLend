'use client';

import React, { FC } from 'react';
import { PuffLoader } from 'react-spinners';

interface OverlaySpinnerProps {
  fetching: boolean;
}

const OverlaySpinner: FC<OverlaySpinnerProps> = ({ fetching }) => (
  <div
    style={{
      position: 'fixed',
      bottom: 45,
      right: 15,
      zIndex: 9999,
      display: fetching ? 'block' : 'none',
    }}
  >
    <PuffLoader color="#8F7AC5" size={30} />
  </div>
);

export { OverlaySpinner };
