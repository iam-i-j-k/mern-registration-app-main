import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = ({ onRegistrationSuccess }) => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required';
    if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
    if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
    if (!formData.address.zipCode.trim()) newErrors['address.zipCode'] = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await authAPI.register(dataToSend);
      
      alert('Registration successful!');
      onRegistrationSuccess(response);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        }
      });
      navigate('/welcome')
    } catch (error) {
      console.error('Registration error:', error);
      if (error.errors) {
        const serverErrors = {};
        error.errors.forEach(err => {
          serverErrors[err.path] = err.msg;
        });
        setErrors(serverErrors);
      } else {
        alert(error.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>User Registration</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
        {/* First Name & Last Name */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label>First Name *</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: errors.firstName ? '2px solid #ff4444' : '1px solid #ddd', borderRadius: '4px' }}/>
            {errors.firstName && <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors.firstName}</span>}
          </div>
          <div>
            <label>Last Name *</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: errors.lastName ? '2px solid #ff4444' : '1px solid #ddd', borderRadius: '4px' }}/>
            {errors.lastName && <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors.lastName}</span>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label>Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: errors.email ? '2px solid #ff4444' : '1px solid #ddd', borderRadius: '4px' }}/>
          {errors.email && <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors.email}</span>}
        </div>

        {/* Password & Confirm Password */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label>Password *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: errors.password ? '2px solid #ff4444' : '1px solid #ddd', borderRadius: '4px' }}/>
            {errors.password && <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors.password}</span>}
          </div>
          <div>
            <label>Confirm Password *</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: errors.confirmPassword ? '2px solid #ff4444' : '1px solid #ddd', borderRadius: '4px' }}/>
            {errors.confirmPassword && <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors.confirmPassword}</span>}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label>Phone *</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: errors.phone ? '2px solid #ff4444' : '1px solid #ddd', borderRadius: '4px' }}/>
          {errors.phone && <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors.phone}</span>}
        </div>

        {/* Date of Birth & Gender */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label>Date of Birth *</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: errors.dateOfBirth ? '2px solid #ff4444' : '1px solid #ddd', borderRadius: '4px' }}/>
            {errors.dateOfBirth && <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors.dateOfBirth}</span>}
          </div>
          <div>
            <label>Gender *</label>
            <select name="gender" value={formData.gender} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: errors.gender ? '2px solid #ff4444' : '1px solid #ddd', borderRadius: '4px' }}>
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors.gender}</span>}
          </div>
        </div>

        {/* Address Fields */}
        <div>
          <label>Street *</label>
          <input type="text" name="address.street" value={formData.address.street} onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: errors['address.street'] ? '2px solid #ff4444' : '1px solid #ddd', borderRadius: '4px' }}/>
          {errors['address.street'] && <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors['address.street']}</span>}
        </div>
        <div>
          <label>City *</label>
          <input type="text" name="address.city" value={formData.address.city} onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: errors['address.city'] ? '2px solid #ff4444' : '1px solid #ddd', borderRadius: '4px' }}/>
          {errors['address.city'] && <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors['address.city']}</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label>State *</label>
            <input type="text" name="address.state" value={formData.address.state} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: errors['address.state'] ? '2px solid #ff4444' : '1px solid #ddd', borderRadius: '4px' }}/>
            {errors['address.state'] && <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors['address.state']}</span>}
          </div>
          <div>
            <label>ZIP Code *</label>
            <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: errors['address.zipCode'] ? '2px solid #ff4444' : '1px solid #ddd', borderRadius: '4px' }}/>
            {errors['address.zipCode'] && <span style={{ color: '#ff4444', fontSize: '14px' }}>{errors['address.zipCode']}</span>}
          </div>
        </div>
        <div>
          <label>Country</label>
          <input type="text" name="address.country" value={formData.address.country} onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}/>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading}
          style={{
            padding: '15px',
            backgroundColor: isLoading ? '#cccccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginTop: '20px'
          }}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
