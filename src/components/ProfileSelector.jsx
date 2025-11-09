import { useState, useRef, useEffect, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useTheme } from '../hooks/useTheme';

export default function ProfileSelector({ onManageClick }) {
  const { profiles, activeProfileId, currentProfile, switchProfile } = useTransactions();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const dropdownRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const profileRefs = useRef([]);

  const profileList = useMemo(() => Object.values(profiles), [profiles]);

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

  useEffect(() => {
    if (isOpen) {
      const activeIndex = profileList.findIndex((profile) => profile.id === activeProfileId);
      setFocusedIndex(activeIndex >= 0 ? activeIndex : 0);
    } else {
      setFocusedIndex(null);
    }
  }, [isOpen, profileList, activeProfileId]);

  useEffect(() => {
    profileRefs.current = profileRefs.current.slice(0, profileList.length);
  }, [profileList]);

  useEffect(() => {
    if (isOpen && focusedIndex !== null) {
      profileRefs.current[focusedIndex]?.focus();
    }
  }, [isOpen, focusedIndex]);

  const handleProfileSelect = (profileId) => {
    switchProfile(profileId);
    setIsOpen(false);
    toggleButtonRef.current?.focus();
  };

  const handleManageButtonClick = () => {
    setIsOpen(false);
    if (onManageClick) {
      onManageClick();
    }
  };

  const handleListKeyDown = (event) => {
    if (!isOpen) return;
    if (profileList.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusedIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % profileList.length;
      });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusedIndex((prev) => {
        if (prev === null) return 0;
        return (prev - 1 + profileList.length) % profileList.length;
      });
    } else if (event.key === 'Home') {
      event.preventDefault();
      setFocusedIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setFocusedIndex(profileList.length - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      toggleButtonRef.current?.focus();
    }
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
      minWidth: '220px',
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
      width: '100%',
      border: 'none',
      backgroundColor: isActive ? theme.accent + '20' : 'transparent',
      borderLeft: isActive ? `4px solid ${theme.accent}` : '4px solid transparent',
      transition: 'all 0.2s ease',
      color: theme.text,
      textAlign: 'left',
      cursor: 'pointer'
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
      width: '100%'
    }
  };

  if (!currentProfile) {
    return null;
  }

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button
        ref={toggleButtonRef}
        style={styles.button}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span style={styles.profileEmoji}>{currentProfile.emoji}</span>
        <span>{currentProfile.name}</span>
        <span style={{ fontSize: '12px', opacity: 0.7 }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={styles.dropdown}
          role="listbox"
          aria-activedescendant={focusedIndex !== null ? `profile-option-${profileList[focusedIndex]?.id}` : undefined}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
        >
          {profileList.map((profile, index) => (
            <button
              key={profile.id}
              id={`profile-option-${profile.id}`}
              type="button"
              className="profile-selector-option"
              ref={(el) => {
                profileRefs.current[index] = el;
              }}
              style={styles.profileItem(profile.id === activeProfileId)}
              role="option"
              aria-selected={profile.id === activeProfileId}
              onClick={() => handleProfileSelect(profile.id)}
            >
              <span style={styles.profileEmoji}>{profile.emoji}</span>
              <span style={styles.profileName}>{profile.name}</span>
              {profile.id === activeProfileId && (
                <span style={styles.checkmark}>✓</span>
              )}
            </button>
          ))}

          <div style={styles.divider} />

          <button
            type="button"
            style={styles.manageButton}
            onClick={handleManageButtonClick}
          >
            <span aria-hidden="true">⚙️</span>
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
        .profile-selector-option:focus-visible {
          outline: 3px solid ${theme.accent};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
