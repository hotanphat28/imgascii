import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Sidebar } from '../components/Sidebar';
import { useStore } from '../useStore';

beforeEach(() => {
  window.URL.createObjectURL = vi.fn(() => 'mock-url');
  window.URL.revokeObjectURL = vi.fn();
});

describe('Sidebar', () => {
  beforeEach(() => {
    useStore.setState({
      imageUrl: null,
      ramp: " .:-=+*#%@",
      resolution: 100,
      invertColors: false,
      contrast: 1,
      foregroundColor: "#00ff00",
      backgroundColor: "#000000",
      asciiText: "",
    });
  });

  it('renders all controls correctly', () => {
    render(<Sidebar />);
    expect(screen.getByText('imgascii')).toBeInTheDocument();
    expect(screen.getByLabelText(/ASCII Character Ramp/i)).toBeInTheDocument();
    expect(screen.getByText(/Resolution/i)).toBeInTheDocument();
    expect(screen.getByText(/Contrast/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Invert Colors/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /DOWNLOAD .PNG/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /DOWNLOAD .TXT/i })).toBeDisabled();
  });

  it('handles image upload', () => {
    render(<Sidebar />);
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(useStore.getState().imageUrl).toBe('mock-url');
  });

  it('updates store on control changes', () => {
    render(<Sidebar />);
    
    const rampInput = screen.getByLabelText(/ASCII Character Ramp/i);
    fireEvent.change(rampInput, { target: { value: '@#%*' } });
    expect(useStore.getState().ramp).toBe('@#%*');
    
    const invertCheckbox = screen.getByLabelText(/Invert Colors/i);
    fireEvent.click(invertCheckbox);
    expect(useStore.getState().invertColors).toBe(true);
  });

  it('enables export buttons when asciiText is present', () => {
    useStore.setState({ asciiText: "test" });
    render(<Sidebar />);
    
    expect(screen.getByRole('button', { name: /DOWNLOAD .PNG/i })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /DOWNLOAD .TXT/i })).not.toBeDisabled();
  });
});
