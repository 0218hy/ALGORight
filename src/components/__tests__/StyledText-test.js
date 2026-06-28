import * as React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MonoText } from '../StyledText';

it(`renders correctly`, () => {
  expect(() => {
    act(() => {
      renderer.create(<MonoText>Snapshot test!</MonoText>);
    });
  }).not.toThrow();
});
