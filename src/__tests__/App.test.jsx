import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App';
import { useStore } from '../useStore';

vi.mock('../AsciiConverter', () => ({
  imageToAscii: vi.fn(() => Promise.resolve('MOCKED ASCII')),
  mapPixelToAscii: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    useStore.setState({
      imageUrl: null,
      asciiText: "",
    });
  });

  it('shows empty state when no image is uploaded', () => {
    render(<App />);
    expect(screen.getByText('No Image Uploaded')).toBeInTheDocument();
  });

  it('renders AsciiPreview when an image is present', async () => {
    useStore.setState({ imageUrl: 'mock-url' });
    render(<App />);
    
    const pre = await screen.findByText('MOCKED ASCII');
    expect(pre).toBeInTheDocument();
  });
});
