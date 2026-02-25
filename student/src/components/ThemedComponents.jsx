/**
 * THEMED COMPONENT EXAMPLES
 * Student Complaint Management System
 * 
 * Copy these components into your project and customize as needed
 */

import React from 'react';

/* ============================================
   THEMED BUTTONS
   ============================================ */

export function ThemedButton({ 
  variant = 'primary', 
  children, 
  disabled = false,
  onClick,
  className = ''
}) {
  const variantClass = {
    primary: 'btn btn--primary',
    secondary: 'btn btn--secondary',
    accent: 'btn btn--accent',
    outline: 'btn btn--outline',
    danger: 'btn btn--danger',
    success: 'btn btn--success',
  }[variant];

  return (
    <button 
      className={`${variantClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}


/* ============================================
   THEMED CARDS
   ============================================ */

export function ThemedCard({ 
  variant = 'default', 
  children, 
  className = '' 
}) {
  const variantClass = {
    default: 'card',
    primary: 'card card--primary',
    success: 'card card--success',
  }[variant];

  return (
    <div className={`${variantClass} ${className}`}>
      {children}
    </div>
  );
}


/* ============================================
   THEMED BADGE (STATUS INDICATOR)
   ============================================ */

export function ThemedBadge({ status }) {
  const statusClass = {
    resolved: 'badge badge--success',
    pending: 'badge badge--pending',
    'in-progress': 'badge badge--resolved',
    rejected: 'badge badge--rejected',
  }[status] || 'badge badge--pending';

  const statusLabel = {
    resolved: 'Resolved',
    pending: 'Pending',
    'in-progress': 'In Progress',
    rejected: 'Rejected',
  }[status] || status;

  return <span className={statusClass}>{statusLabel}</span>;
}


/* ============================================
   THEMED ALERT
   ============================================ */

export function ThemedAlert({ 
  type = 'info', 
  message, 
  onClose = () => {} 
}) {
  const alertClass = {
    success: 'alert alert--success',
    warning: 'alert alert--warning',
    danger: 'alert alert--danger',
    info: 'alert alert--info',
  }[type];

  const icons = {
    success: '✓',
    warning: '⚠',
    danger: '✕',
    info: 'ℹ',
  };

  return (
    <div className={alertClass} role="alert">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{icons[type]} {message}</span>
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}


/* ============================================
   FORM INPUT COMPONENTS
   ============================================ */

export function ThemedInput({ 
  label, 
  error = '', 
  required = false,
  ...props 
}) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
      )}
      <input 
        className={`form-input ${error ? 'form-input--error' : ''}`}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

export function ThemedTextarea({ 
  label, 
  error = '', 
  required = false,
  ...props 
}) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
      )}
      <textarea 
        className={`form-textarea ${error ? 'form-textarea--error' : ''}`}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

export function ThemedSelect({ 
  label, 
  options = [], 
  error = '', 
  required = false,
  ...props 
}) {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
      )}
      <select 
        className={`form-select ${error ? 'form-select--error' : ''}`}
        {...props}
      >
        <option value="">Select {label?.toLowerCase() || 'an option'}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}


/* ============================================
   COMPLAINT FORM COMPONENT
   ============================================ */

export function ComplaintForm({ onSubmit = () => {} }) {
  const [formData, setFormData] = React.useState({
    title: '',
    category: '',
    description: '',
    attachment: null,
  });

  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  const categories = [
    { value: 'academic', label: 'Academic' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'conduct', label: 'Conduct & Discipline' },
    { value: 'health', label: 'Health & Safety' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      onSubmit(formData);
      // Reset form
      setFormData({ title: '', category: '', description: '', attachment: null });
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <ThemedCard variant="primary">
      <h2 style={{ color: '#1f2937', marginTop: 0 }}>Submit a Complaint</h2>
      
      {submitted && (
        <ThemedAlert 
          type="success" 
          message="Your complaint has been submitted successfully!"
        />
      )}

      <form onSubmit={handleSubmit}>
        <ThemedInput
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Brief title of your complaint"
          error={errors.title}
          required
        />

        <ThemedSelect
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories}
          error={errors.category}
          required
        />

        <ThemedTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your complaint in detail..."
          error={errors.description}
          required
        />

        <div className="form-group">
          <label className="form-label">Attachment (Optional)</label>
          <input 
            className="form-input"
            type="file"
            onChange={(e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }))}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <ThemedButton variant="primary" type="submit">
            Submit Complaint
          </ThemedButton>
          <ThemedButton 
            variant="outline" 
            type="reset"
            onClick={() => {
              setFormData({ title: '', category: '', description: '', attachment: null });
              setErrors({});
            }}
          >
            Clear Form
          </ThemedButton>
        </div>
      </form>
    </ThemedCard>
  );
}


/* ============================================
   COMPLAINT CARD COMPONENT
   ============================================ */

export function ComplaintCardComponent({ 
  complaint,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {}
}) {
  const { id, title, category, status, date, description } = complaint;

  return (
    <ThemedCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h3 style={{ color: '#1f2937', marginTop: 0 }}>{title}</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              <strong>Category:</strong> {category}
            </span>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              <strong>Date:</strong> {date}
            </span>
          </div>
        </div>
        <ThemedBadge status={status} />
      </div>
      
      <p style={{ color: '#4b5563', marginTop: '1rem' }}>{description}</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <ThemedButton variant="primary" onClick={() => onView(id)}>
          View Details
        </ThemedButton>
        <ThemedButton variant="secondary" onClick={() => onEdit(id)}>
          Edit
        </ThemedButton>
        <ThemedButton variant="danger" onClick={() => onDelete(id)}>
          Delete
        </ThemedButton>
      </div>
    </ThemedCard>
  );
}


/* ============================================
   STATUS DASHBOARD COMPONENT
   ============================================ */

export function StatusDashboard({ stats }) {
  const defaultStats = {
    total: 24,
    resolved: 18,
    pending: 5,
    rejected: 1,
  };

  const displayStats = stats || defaultStats;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
      {/* Total */}
      <ThemedCard>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Total Complaints</p>
        <h2 style={{ color: '#2563eb', margin: '0.5rem 0 0 0', fontSize: '2rem' }}>
          {displayStats.total}
        </h2>
      </ThemedCard>

      {/* Resolved */}
      <ThemedCard variant="success">
        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Resolved</p>
        <h2 style={{ color: '#10b981', margin: '0.5rem 0 0 0', fontSize: '2rem' }}>
          {displayStats.resolved}
        </h2>
        <span className="badge badge--success">
          {((displayStats.resolved / displayStats.total) * 100).toFixed(0)}%
        </span>
      </ThemedCard>

      {/* Pending */}
      <ThemedCard>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Pending</p>
        <h2 style={{ color: '#f59e0b', margin: '0.5rem 0 0 0', fontSize: '2rem' }}>
          {displayStats.pending}
        </h2>
        <span className="badge badge--pending">
          {((displayStats.pending / displayStats.total) * 100).toFixed(0)}%
        </span>
      </ThemedCard>

      {/* Rejected */}
      <ThemedCard>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Rejected</p>
        <h2 style={{ color: '#dc2626', margin: '0.5rem 0 0 0', fontSize: '2rem' }}>
          {displayStats.rejected}
        </h2>
        <span className="badge badge--rejected">
          {((displayStats.rejected / displayStats.total) * 100).toFixed(0)}%
        </span>
      </ThemedCard>
    </div>
  );
}


/* ============================================
   THEMED TABLE COMPONENT
   ============================================ */

export function ThemedTable({ columns, data, actions = [] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{col.label}</th>
          ))}
          {actions.length > 0 && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map(col => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
            {actions.length > 0 && (
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {actions.map(action => (
                    <ThemedButton 
                      key={action.label}
                      variant={action.variant || 'primary'}
                      onClick={() => action.onClick(row)}
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      {action.label}
                    </ThemedButton>
                  ))}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default {
  ThemedButton,
  ThemedCard,
  ThemedBadge,
  ThemedAlert,
  ThemedInput,
  ThemedTextarea,
  ThemedSelect,
  ComplaintForm,
  ComplaintCardComponent,
  StatusDashboard,
  ThemedTable,
};
