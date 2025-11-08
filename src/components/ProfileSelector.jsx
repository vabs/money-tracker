import { useState, useRef, useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';

export default function ProfileSelector({ theme, onManageClick }) {
  const { profiles, activeProfileId, currentProfile, switchProfile } = useTransactions();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const profileList = Object.values(profiles);

  const handleProfileSelect = (profileId) => {
    switchProfile(profileId);
    setIsOpen(false);
  };

  const styles = {
    container: {
      position: 'relative',
      zIndex: 1001
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: theme.background,
      border: `2px solid ${theme.accent}`,
      borderRadius: '12px',
      color: theme.text,
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: `0 2px 8px ${theme.accent}40`,
      outline: 'none'
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      left: 0,
      minWidth: '200px',
      backgroundColor: theme.background,
      border: `2px solid ${theme.accent}`,
      borderRadius: '12px',
      boxShadow: `0 4px 16px ${theme.accent}60`,
      overflow: 'hidden',
      animation: 'slideDown 0.2s ease'
    },
    profileItem: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      cursor: 'pointer',
      backgroundColor: isActive ? theme.accent + '20' : 'transparent',
      borderLeft: isActive ? `4px solid ${theme.accent}` : '4px solid transparent',
      transition: 'all 0.2s ease',
      color: theme.text
    }),
    profileEmoji: {
      fontSize: '20px'
    },
    profileName: {
      flex: 1,
      fontSize: '14px',
      fontWeight: '600'
    },
    checkmark: {
      fontSize: '16px',
      color: theme.accent
    },
    divider: {
      height: '1px',
      backgroundColor: theme.accent + '30',
      margin: '4px 0'
    },
    manageButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 16px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: theme.accent,
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
      width: '100%',
      transition: 'all 0.2s ease'
    }
  };

  if (!currentProfile) {
    return null;
  }

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button
        style={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${theme.accent}60`;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 2px 8px ${theme.accent}40`;
        }}
      >
        <span style={styles.profileEmoji}>{currentProfile.emoji}</span>
        <span>{currentProfile.name}</span>
        <span style={{ fontSize: '12px', opacity: 0.7 }}>▼</span>
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          {profileList.map((profile) => (
            <div
              key={profile.id}
              style={styles.profileItem(profile.id === activeProfileId)}
              onClick={() => handleProfileSelect(profile.id)}
              onMouseOver={(e) => {
                if (profile.id !== activeProfileId) {
                  e.currentTarget.style.backgroundColor = theme.accent + '10';
                }
              }}
              onMouseOut={(e) => {
                if (profile.id !== activeProfileId) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={styles.profileEmoji}>{profile.emoji}</span>
              <span style={styles.profileName}>{profile.name}</span>
              {profile.id === activeProfileId && (
                <span style={styles.checkmark}>✓</span>
              )}
            </div>
          ))}
          
          <div style={styles.divider} />
          
          <button
            style={styles.manageButton}
            onClick={() => {
              setIsOpen(false);
              onManageClick();
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme.accent + '10';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span>⚙️</span>
            <span>Manage Profiles</span>
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
