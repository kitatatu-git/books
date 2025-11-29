import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// サンプルコンポーネント
function SampleComponent({ message }: { message: string }) {
  return <div>{message}</div>;
}

describe('SampleComponent', () => {
  it('should render the message', () => {
    const testMessage = 'Hello, Vitest!';
    render(<SampleComponent message={testMessage} />);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it('should render different messages', () => {
    const message1 = 'First message';
    const { rerender } = render(<SampleComponent message={message1} />);
    expect(screen.getByText(message1)).toBeInTheDocument();

    const message2 = 'Second message';
    rerender(<SampleComponent message={message2} />);
    expect(screen.getByText(message2)).toBeInTheDocument();
  });
});
