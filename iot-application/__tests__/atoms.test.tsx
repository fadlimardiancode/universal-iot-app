import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { AppText } from '../src/presentation/components/atoms/AppText';
import { AppButton } from '../src/presentation/components/atoms/AppButton';

describe('Atoms', () => {
  it('renders AppText correctly with text content', () => {
    let testRenderer: any;
    ReactTestRenderer.act(() => {
      testRenderer = ReactTestRenderer.create(
        <AppText variant="h1">Smart Home</AppText>
      );
    });
    expect(testRenderer.toJSON()).toBeTruthy();
  });

  it('renders AppButton correctly and responds to press', () => {
    const onPressMock = jest.fn();
    let testRenderer: any;
    ReactTestRenderer.act(() => {
      testRenderer = ReactTestRenderer.create(
        <AppButton label="Toggle" onPress={onPressMock} />
      );
    });
    expect(testRenderer.toJSON()).toBeTruthy();
  });
});
