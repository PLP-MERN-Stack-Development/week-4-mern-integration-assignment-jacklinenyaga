import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/api';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getAllPosts();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid item xs={12} sm={6} md={4} key={post._id}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.excerpt}
              </Typography>
              <Button
                component={Link}
                to={`/posts/${post._id}`}
                variant="contained"
                size="small"
                sx={{ mt: 2 }}
              >
                Read More
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList;