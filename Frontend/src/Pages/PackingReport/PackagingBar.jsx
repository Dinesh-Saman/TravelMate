import React from 'react';
import { useNavigate } from 'react-router-dom';

const PackagingBar = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.landscapeHeader}>
      <div style={styles.headerOverlay}>
        <div style={styles.contentWrapper}>
          <h1 style={styles.headerTitle}>Prepare Your Adventure Packing List</h1>
            <button 
            onClick={() => navigate('/packing-list')}
            style={styles.navButton}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
            Start Packing Now →
            </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  landscapeHeader: {
    width: '100%',
    height: '400px',
    backgroundImage: 'url(https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '10px',
    marginTop: '10px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.25)',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    textAlign: 'center',
    padding: '20px',
    maxWidth: '800px',
  },
  headerTitle: {
    color: 'white',
    fontSize: '3rem',
    fontWeight: '800',
    textAlign: 'center',
    textShadow: '2px 2px 12px rgba(0, 0, 0, 0.8)',
    marginBottom: '30px',
    lineHeight: '1.2',
  },
  navButton: {
    padding: '15px 40px',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: 'transparent',
    border: '2px solid white',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: '#ffffff',
      borderColor: '#ffffff',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
    },
    ':active': {
      transform: 'translateY(0)',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    }
  },
  '@media (max-width: 768px)': {
    landscapeHeader: {
      height: '300px',
    },
    headerTitle: {
      fontSize: '2.2rem',
      marginBottom: '20px',
    },
    navButton: {
      padding: '12px 30px',
      fontSize: '1rem',
    },
  },
  '@media (max-width: 480px)': {
    headerTitle: {
      fontSize: '1.8rem',
    },
  },
};

export default PackagingBar;