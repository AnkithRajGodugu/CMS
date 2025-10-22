import React from 'react';
import { useForm } from 'react-hook-form';

/**
 * FormBuilder - Dynamic form component with validation
 * @param {Array} fields - Field configuration array
 * @param {Function} onSubmit - Form submit handler
 * @param {Object} defaultValues - Default form values
 * @param {String} submitLabel - Submit button label (default: 'Submit')
 * @param {Boolean} loading - Loading state for submit button
 * 
 * Field configuration:
 * {
 *   name: string,
 *   label: string,
 *   type: 'text'|'email'|'password'|'number'|'textarea'|'select'|'checkbox'|'radio'|'date',
 *   placeholder: string,
 *   required: boolean,
 *   validation: object (react-hook-form validation rules),
 *   options: array (for select/radio),
 *   rows: number (for textarea),
 *   disabled: boolean
 * }
 */
const FormBuilder = ({ 
  fields = [], 
  onSubmit,
  defaultValues = {},
  submitLabel = 'Submit',
  loading = false,
  className = ''
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ defaultValues });

  const renderField = (field) => {
    const {
      name,
      label,
      type = 'text',
      placeholder,
      required = false,
      validation = {},
      options = [],
      rows = 3,
      disabled = false
    } = field;

    const baseValidation = {
      ...validation,
      ...(required && { required: `${label} is required` })
    };

    const fieldClasses = `
      input input-bordered w-full
      ${errors[name] ? 'input-error' : ''}
    `;

    const textareaClasses = `
      textarea textarea-bordered w-full
      ${errors[name] ? 'textarea-error' : ''}
    `;

    const selectClasses = `
      select select-bordered w-full
      ${errors[name] ? 'select-error' : ''}
    `;

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...register(name, baseValidation)}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={textareaClasses}
            aria-invalid={errors[name] ? 'true' : 'false'}
          />
        );

      case 'select':
        return (
          <select
            {...register(name, baseValidation)}
            disabled={disabled}
            className={selectClasses}
            aria-invalid={errors[name] ? 'true' : 'false'}
          >
            <option value="">Select {label}</option>
            {options.map((option, index) => (
              <option 
                key={index} 
                value={option.value || option}
              >
                {option.label || option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                {...register(name, baseValidation)}
                disabled={disabled}
                className="checkbox checkbox-primary"
              />
              <span className="label-text">{label}</span>
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option, index) => (
              <label 
                key={index} 
                className="label cursor-pointer justify-start gap-3"
              >
                <input
                  type="radio"
                  {...register(name, baseValidation)}
                  value={option.value || option}
                  disabled={disabled}
                  className="radio radio-primary"
                />
                <span className="label-text">{option.label || option}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
      case 'email':
      case 'password':
      case 'number':
      case 'text':
      default:
        return (
          <input
            type={type}
            {...register(name, baseValidation)}
            placeholder={placeholder}
            disabled={disabled}
            className={fieldClasses}
            aria-invalid={errors[name] ? 'true' : 'false'}
          />
        );
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className={`space-y-4 ${className}`}
      noValidate
    >
      {fields.map((field, index) => (
        <div key={field.name || index} className="form-control w-full">
          {field.type !== 'checkbox' && (
            <label className="label">
              <span className="label-text font-medium">
                {field.label}
                {field.required && <span className="text-error ml-1">*</span>}
              </span>
            </label>
          )}
          
          {renderField(field)}
          
          {errors[field.name] && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors[field.name].message}
              </span>
            </label>
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className={`btn btn-primary ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="btn btn-ghost"
          disabled={loading}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default FormBuilder;
