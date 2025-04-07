import React from 'react';
import { render, screen } from '@testing-library/react';
import Container from '@/components/layouts/Container';

describe('Container', () => {
  test('renders children correctly', () => {
    render(
      <Container>
        <div data-testid="child">Test Child</div>
      </Container>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  test('applies default max width class', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('max-w-7xl');
  });

  test('applies fullWidth class when specified', () => {
    const { container } = render(
      <Container fullWidth>
        <div>Content</div>
      </Container>
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('max-w-8xl');
  });

  test('applies boxed styling when specified', () => {
    const { container } = render(
      <Container boxed>
        <div>Content</div>
      </Container>
    );
    
    // The first child is the container, the second child is the boxed div
    const boxedElement = container.firstChild?.firstChild;
    expect(boxedElement).toHaveClass('bg-secondary/10');
    expect(boxedElement).toHaveClass('rounded-xl');
  });

  test('applies custom className when provided', () => {
    const { container } = render(
      <Container className="test-class">
        <div>Content</div>
      </Container>
    );
    
    const containerElement = container.firstChild;
    expect(containerElement).toHaveClass('test-class');
  });
});