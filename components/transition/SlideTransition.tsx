import { Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as React from 'react';

const SlideTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default SlideTransition;
