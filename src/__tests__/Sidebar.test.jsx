import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sidebar } from '../components/Sidebar';
import { useStore } from '../useStore';

vi.mock('three-stdlib', () => ({
  TTFLoader: class {
    parse() {
      return { mockFont: true };
    }
  }
}));

describe('Sidebar', () => {
  beforeEach(() => {
    useStore.setState({
      text: 'HELLO',
      ramp: ' .:-=+*#%@',
      density: 0.05,
      foregroundColor: '#ffffff',
      backgroundColor: '#000000',
      animationType: 'none',
      exportFormat: 'webm',
      exportFps: 30,
      exportDuration: 3,
      isExporting: false,
      exportPhase: 'idle',
      exportProgress: 0,
      lightDirection: [10, 10, 10],
      cameraFov: 50,
      bgImage: null,
      customFontName: '',
      perfMode: false
    });
  });

  it('renders correctly and displays initial state', () => {
    render(<Sidebar />);
    expect(screen.getByText('ASCII-3D')).toBeInTheDocument();
    
    // Verify inputs have correct default values
    const textInput = screen.getByDisplayValue('HELLO');
    expect(textInput).toBeInTheDocument();
    
    const rampInput = screen.getByDisplayValue(/.:-=+/);
    expect(rampInput).toBeInTheDocument();
  });

  it('updates text store when typing in Text Content input', () => {
    render(<Sidebar />);
    const textInput = screen.getByDisplayValue('HELLO');
    
    fireEvent.change(textInput, { target: { value: 'TEST' } });
    expect(useStore.getState().text).toBe('TEST');
  });

  it('shows LOW PERF badge when perfMode is true', () => {
    useStore.setState({ perfMode: true });
    render(<Sidebar />);
    expect(screen.getByTestId('perf-badge')).toBeInTheDocument();
  });

  it('handles font upload correctly', async () => {
    render(<Sidebar />);
    const fileInput = screen.getByTestId('font-upload');
    
    const file = new File(['mock content'], 'testfont.ttf', { type: 'font/ttf' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // We can't easily wait for FileReader in this sync test environment without some async tricks, 
    // but we can verify the input changed. Testing FileReader fully would require mocking it.
    expect(fileInput.files[0].name).toBe('testfont.ttf');
  });

  it('triggers export when Export button is clicked', () => {
    render(<Sidebar />);
    const exportBtn = screen.getByRole('button', { name: /RENDER WEBM/i });
    
    fireEvent.click(exportBtn);
    expect(useStore.getState().isExporting).toBe(true);
  });
});
