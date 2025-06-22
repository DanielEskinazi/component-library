/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '../test-utils';

describe('React Tailwind Package', () => {
  it('should render basic React components', () => {
    const TestComponent = () => <div data-testid="test">Hello React</div>;
    
    render(<TestComponent />);
    
    const element = screen.getByTestId('test');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Hello React');
  });

  it('should support TypeScript', () => {
    interface Props {
      message: string;
    }
    
    const TypedComponent: React.FC<Props> = ({ message }) => (
      <div data-testid="typed">{message}</div>
    );
    
    render(<TypedComponent message="TypeScript works" />);
    
    const element = screen.getByTestId('typed');
    expect(element).toHaveTextContent('TypeScript works');
  });

  it('should have React Testing Library utilities', () => {
    expect(render).toBeDefined();
    expect(screen).toBeDefined();
  });
});