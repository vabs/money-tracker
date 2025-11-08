import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { getCurrentValue, formatCurrency } from '../utils/calculations';

export default function ProfileManager({ theme, onClose }) {
  const { profiles, currentProfile, addProfile, updateProfile, deleteProfile } = useTransactions();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    emoji: '👤',
    initialAmount: '1000',
    annualInterestRate: '7',
    startDate: new Date().toISOString().split('T')[0]
  });

  const profileList = Object.values(profiles);

  const emojiOptions = ['👦', '👧', '👨', '👩', '🧒', '👶', '👤', '😊', '🎓', '🎨', '⚽', '🎮'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a name');
      return;
    }

    // Trim name to 50 characters
    const trimmedName = formData.name.trim().substring(0, 50);

    if (editingId) {
      // Update existing profile
      updateProfile(editingId, {
        name: trimmedName,
        emoji: formData.emoji,
        config: {
          initialAmount: parseFloat(formData.initialAmount),
          annualInterestRate: parseFloat(formData.annualInterestRate),
          startDate: formData.startDate
        }
      });
      setEditingId(null);
    } else {
      // Add new profile
      addProfile(trimmedName, formData.emoji, {
        initialAmount: parseFloat(formData.initialAmount),
        annualInterestRate: parseFloat(formData.annualInterestRate),
        startDate: formData.startDate
      });
      setShowAddForm(false);
    }

    // Reset form
    setFormData({
      name: '',
      emoji: '👤',
      initialAmount: '1000',
      annualInterestRate: '7',
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleEdit = (profile) => {
    // Trim name to 50 characters when editing
    const trimmedName = profile.name.substring(0, 50);
    setFormData({
      name: trimmedName,
      emoji: profile.emoji,
      initialAmount: profile.config.initialAmount.toString(),
      annualInterestRate: profile.config.annualInterestRate.toString(),
      startDate: profile.config.startDate
    });
    setEditingId(profile.id);
    setShowAddForm(true);
  };

  const handleDelete = (profileId) => {
    if (profileList.length === 1) {
      alert('Cannot delete the last profile');
      return;
    }

    const profile = profiles[profileId];
    if (confirm(`Are you sure you want to delete "${profile.name}"? This cannot be undone.`)) {
      deleteProfile(profileId);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      emoji: '👤',
      initialAmount: '1000',
      annualInterestRate: '7',
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const getProfileBalance = (profile) => {
    return getCurrentValue(
      profile.config.initialAmount,
      profile.config.annualInterestRate,
      profile.config.startDate,
      profile.transactions
    );
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    },
    modal: {
      backgroundColor: theme.background,
      borderRadius: '16px',
      border: `2px solid ${theme.accent}`,
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: `0 8px 32px ${theme.accent}60`
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: `2px solid ${theme.accent}30`
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: theme.text,
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: theme.text,
      padding: '4px',
      opacity: 0.7,
      transition: 'opacity 0.2s'
    },
    content: {
      padding: '24px'
    },
    profileCard: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: isActive ? theme.accent + '20' : theme.background,
      border: `2px solid ${isActive ? theme.accent : theme.accent + '40'}`,
      borderRadius: '12px',
      transition: 'all 0.2s ease'
    }),
    profileEmoji: {
      fontSize: '32px'
    },
    profileInfo: {
      flex: 1
    },
    profileName: {
      fontSize: '18px',
      fontWeight: '700',
      color: theme.text,
      marginBottom: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    profileStats: {
      fontSize: '14px',
      color: theme.text,
      opacity: 0.7
    },
    profileActions: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: (variant = 'default') => ({
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: variant === 'delete' ? '#fee2e2' : theme.accent + '40',
      color: variant === 'delete' ? '#dc2626' : theme.text,
      minWidth: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }),
    actionButtonText: {
      display: 'inline',
      '@media (max-width: 640px)': {
        display: 'none'
      }
    },
    actionButtonIcon: {
      display: 'none',
      '@media (max-width: 640px)': {
        display: 'inline'
      }
    },
    addButton: {
      width: '100%',
      padding: '16px',
      fontSize: '16px',
      fontWeight: '600',
      backgroundColor: theme.accent,
      color: theme.text,
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: '16px'
    },
    form: {
      marginTop: '16px',
      padding: '20px',
      backgroundColor: theme.accent + '10',
      borderRadius: '12px',
      border: `2px solid ${theme.accent}40`
    },
    inputGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: theme.text
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      borderRadius: '8px',
      border: `2px solid ${theme.accent}`,
      backgroundColor: theme.background,
      color: theme.text,
      outline: 'none'
    },
    emojiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '8px',
      marginTop: '8px'
    },
    emojiButton: (isSelected) => ({
      fontSize: '24px',
      padding: '8px',
      border: `2px solid ${isSelected ? theme.accent : theme.accent + '40'}`,
      borderRadius: '8px',
      backgroundColor: isSelected ? theme.accent + '40' : 'transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }),
    formActions: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px'
    },
    submitButton: {
      flex: 1,
      padding: '12px',
      fontSize: '16px',
      fontWeight: '600',
      backgroundColor: theme.accent,
      color: theme.text,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    cancelButton: {
      flex: 1,
      padding: '12px',
      fontSize: '16px',
      fontWeight: '600',
      backgroundColor: 'transparent',
      color: theme.text,
      border: `2px solid ${theme.accent}`,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Manage Profiles</h2>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
          >
            ✕
          </button>
        </div>

        <div style={styles.content}>
          {profileList.map((profile) => (
            <div
              key={profile.id}
              style={styles.profileCard(profile.id === currentProfile?.id)}
            >
              <div style={styles.profileEmoji}>{profile.emoji}</div>
              <div style={styles.profileInfo}>
                <div style={styles.profileName}>{profile.name.substring(0, 50)}</div>
                <div style={styles.profileStats}>
                  {formatCurrency(getProfileBalance(profile))} • {profile.transactions.length} transactions
                </div>
              </div>
              <div style={styles.profileActions}>
                <button
                  style={styles.actionButton()}
                  onClick={() => handleEdit(profile)}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.accent + '60'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.accent + '40'}
                  title="Edit profile"
                >
                  <span className="action-text">Edit</span>
                  <span className="action-icon">✏️</span>
                </button>
                <button
                  style={styles.actionButton('delete')}
                  onClick={() => handleDelete(profile.id)}
                  disabled={profileList.length === 1}
                  onMouseOver={(e) => {
                    if (profileList.length > 1) {
                      e.currentTarget.style.backgroundColor = '#fecaca';
                    }
                  }}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                  title="Delete profile"
                >
                  <span className="action-text">Delete</span>
                  <span className="action-icon">🗑️</span>
                </button>
              </div>
            </div>
          ))}

          {showAddForm ? (
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Name (max 50 characters)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                  style={styles.input}
                  maxLength={50}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Emoji</label>
                <div style={styles.emojiGrid}>
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      style={styles.emojiButton(formData.emoji === emoji)}
                      onClick={() => setFormData({ ...formData, emoji })}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Initial Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.initialAmount}
                  onChange={(e) => setFormData({ ...formData, initialAmount: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Annual Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.annualInterestRate}
                  onChange={(e) => setFormData({ ...formData, annualInterestRate: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formActions}>
                <button type="submit" style={styles.submitButton}>
                  {editingId ? 'Update Profile' : 'Add Profile'}
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              style={styles.addButton}
              onClick={() => setShowAddForm(true)}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              ➕ Add New Profile
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 641px) {
          .action-icon {
            display: none !important;
          }
          .action-text {
            display: inline !important;
          }
        }
        @media (max-width: 640px) {
          .action-icon {
            display: inline !important;
          }
          .action-text {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
