import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PhotoEditor from '@/components/photo/PhotoEditor';

describe('PhotoEditor', () => {
  const mockSave = jest.fn();
  const mockCancel = jest.fn();
  
  const defaultProps = {
    initialTitle: 'Test Photo',
    initialDescription: 'Test Description',
    initialTags: ['nature', 'vacation'],
    onSave: mockSave,
    onCancel: mockCancel,
    isLoading: false,
  };
  
  beforeEach(() => {
    mockSave.mockClear();
    mockCancel.mockClear();
  });
  
  test('renders with initial values', () => {
    render(<PhotoEditor {...defaultProps} />);
    
    expect(screen.getByLabelText(/title/i)).toHaveValue('Test Photo');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Test Description');
    expect(screen.getByLabelText(/tags/i)).toHaveValue('nature, vacation');
  });
  
  test('updates form values on change', () => {
    render(<PhotoEditor {...defaultProps} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const tagsInput = screen.getByLabelText(/tags/i);
    
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
    fireEvent.change(tagsInput, { target: { value: 'updated, tags' } });
    
    expect(titleInput).toHaveValue('Updated Title');
    expect(descriptionInput).toHaveValue('Updated Description');
    expect(tagsInput).toHaveValue('updated, tags');
  });
  
  test('calls onSave with updated values when form is submitted', () => {
    const { container } = render(<PhotoEditor {...defaultProps} />);
    
    // Update form values
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Title' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'New Description' } });
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'new, tags' } });
    
    // Submit the form - using querySelector since form doesn't have an implicit role
    const form = container.querySelector('form');
    fireEvent.submit(form);
    
    // Check if onSave was called with correct values
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledWith(
      'New Title', 
      'New Description', 
      ['new', 'tags']
    );
  });
  
  test('calls onCancel when cancel button is clicked', () => {
    render(<PhotoEditor {...defaultProps} />);
    
    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);
    
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
  
  test('disables form controls when isLoading is true', () => {
    render(<PhotoEditor {...defaultProps} isLoading={true} />);
    
    expect(screen.getByLabelText(/title/i)).toBeDisabled();
    expect(screen.getByLabelText(/description/i)).toBeDisabled();
    expect(screen.getByLabelText(/tags/i)).toBeDisabled();
    // Use getByRole with name to get the actual buttons
    expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });
});