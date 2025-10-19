import { useState, useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createBale, updateBale, deleteBale, getBaleById } from '../api/baleApi';

export const BaleEntry = ({ baleId = null, onSuccess = () => {} }) => {
  const queryClient = useQueryClient();
  const isEditing = !!baleId;

  // Form state
  const [formData, setFormData] = useState({
    baleType: '',
    transactionType: '',
    quantity: '',
    pricePerUnit: '',
    description: ''
  });

  // Fetch bale data if in edit mode
  const { data: baleData, isLoading } = useQuery({
    queryKey: ['bales', baleId],
    queryFn: () => getBaleById(baleId),
    enabled: isEditing,
    onSuccess: (data) => {
      setFormData({
        baleType: data.baleType,
        transactionType: data.transactionType,
        quantity: data.quantity.toString(),
        pricePerUnit: data.pricePerUnit.toString(),
        description: data.description || ''
      });
    }
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: createBale,
    onSuccess: () => {
      toast.success('Bale created successfully!');
      queryClient.invalidateQueries(['bales']);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create bale');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateBale(baleId, data),
    onSuccess: () => {
      toast.success('Bale updated successfully!');
      queryClient.invalidateQueries(['bales']);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update bale');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBale(baleId),
    onSuccess: () => {
      toast.success('Bale deleted successfully!');
      queryClient.invalidateQueries(['bales']);
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete bale');
    }
  });

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      quantity: parseFloat(formData.quantity),
      pricePerUnit: parseFloat(formData.pricePerUnit)
    };

    if (isEditing) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this bale?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) return <div>Loading bale data...</div>;

  return (
    <form onSubmit={handleSubmit} className="bale-form">
      <h2>{isEditing ? 'Edit Bale' : 'Create New Bale'}</h2>

      <div className="form-grid">
        {/* Bale Type */}
        <div className="form-group">
          <label>Bale Type</label>
          <select
            name="baleType"
            value={formData.baleType}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="cotton">Cotton</option>
            <option value="jute">Jute</option>
            <option value="wool">Wool</option>
          </select>
        </div>

        {/* Transaction Type */}
        <div className="form-group">
          <label>Transaction Type</label>
          <select
            name="transactionType"
            value={formData.transactionType}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="purchase">Purchase</option>
            <option value="sale">Sale</option>
          </select>
        </div>

        {/* Quantity */}
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            step="0.01"
            required
          />
        </div>

        {/* Price Per Unit */}
        <div className="form-group">
          <label>Price Per Unit</label>
          <input
            type="number"
            name="pricePerUnit"
            value={formData.pricePerUnit}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            maxLength="500"
          />
        </div>
      </div>

      <div className="form-actions">
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="delete-btn"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
          </button>
        )}
        <button
          type="submit"
          className="submit-btn"
          disabled={createMutation.isLoading || updateMutation.isLoading}
        >
          {isEditing 
            ? (updateMutation.isLoading ? 'Updating...' : 'Update')
            : (createMutation.isLoading ? 'Creating...' : 'Create')} Bale
        </button>
      </div>
    </form>
  );
};