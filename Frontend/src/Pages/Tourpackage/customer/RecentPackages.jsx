import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid,
  Container
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { ExploreOutlined, AccessTime } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  section: {
    padding: theme.spacing(8, 0),
    backgroundColor: theme.palette.background.default,
  },
  sectionTitle: {
    position: 'relative',
    marginBottom: theme.spacing(6),
    '&::after': {
      content: '""',
      display: 'block',
      width: '80px',
      height: '4px',
      backgroundColor: theme.palette.primary.main,
      margin: theme.spacing(2, 'auto', 0),
    }
  },
  packageCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    }
  },
  cardMedia: {
    height: 250,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  bookButton: {
    marginTop: 'auto',
    width: '100%',
  },
  price: {
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
    fontSize: '1.2rem',
    marginTop: theme.spacing(1),
  },
  viewMoreButton: {
    marginTop: theme.spacing(3),
    // Base styles
    borderWidth: 2,
    transition: 'all 0.3s ease',
    // Hover styles
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      borderWidth: 2,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
    // Focus styles
    '&:focus': {
      boxShadow: `0 0 0 0.2rem ${theme.palette.primary.light}`,
    },
    // Active styles
    '&:active': {
      transform: 'translateY(0)',
    }
  }
}));

const RecentPackages = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchRecentPackages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/package');
        // Sort packages by creation date and take the first 4
        const sortedPackages = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setPackages(sortedPackages);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchRecentPackages();
  }, []);

  const handleViewMorePackages = () => {
    navigate('/packages');
  };

  return (
    <Box className={classes.section}>
      <Container>
        <Typography 
          variant="h3" 
          align="center" 
          className={classes.sectionTitle}
          style={{ fontWeight: 'bold' }}
        >
          Explore Packages
        </Typography>
        <Typography 
          variant="h6" 
          align="center" 
          color="textSecondary" 
          paragraph
          style={{ maxWidth: '800px', margin: '0 auto 40px' }}
        >
          Discover our featured travel packages and plan your next adventure
        </Typography>
        
        <Grid container spacing={4}>
          {packages.map((pkg) => (
            <Grid item xs={12} sm={6} md={3} key={pkg._id}>
              <Card className={classes.packageCard} elevation={3}>
                <CardMedia
                  className={classes.cardMedia}
                  image={pkg.image.startsWith('http') 
                    ? pkg.image 
                    : `http://localhost:3001${pkg.image}`
                  }
                  title={pkg.name}
                />
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ExploreOutlined style={{ marginRight: '8px', color: '#1976d2' }} />
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                      {pkg.name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AccessTime style={{ marginRight: '8px', color: '#757575' }} />
                    <Typography variant="body2" color="textSecondary">
                      {pkg.duration}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {pkg.location}
                  </Typography>
                  <Typography className={classes.price}>
                    ${pkg.price.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="center" mt={4}>
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            onClick={handleViewMorePackages}
            className={classes.viewMoreButton}
          >
            View More Packages
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RecentPackages;