import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader, CardMedia, Collapse, Grid,
  IconButton,
  Menu, MenuItem, Modal, Popover,
  Typography,
} from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { pink, red } from '@mui/material/colors';
import AvatarGroup from '@mui/material/AvatarGroup';
import TextField from '@mui/material/TextField';

import { InsertLink } from '@mui/icons-material';
import { handleImageError } from '../../services/componentHandlers';
import { ExpandMore } from '../../styles/expandMoreAnimation';
import { postPropTypes } from '../../propTypes/postPT';
import EditPostFormContainer from '../../containers/post/editPostForm';
import { modalBoxStyle } from '../../styles/modalStyle';
import authContext from '../../authContext';
import { checkAvatarUrlData, checkPostImageUrlData } from '../../services/avatarLinkChecker';
import CommentsContainer from '../../containers/comments';

const config = require('../../config/app.config');

export const Post = function ({
  post, mutate, reloadPosts, setOpenSnackbar,
}) {
  const { store } = useContext(authContext);

  const [expanded, setExpanded] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElPopover, setAnchorElPopover] = useState(null);
  const [isPostDeleted, setPostDeleted] = useState(false);

  const postData = { ...post };
  const postLikes = post.Post_likes;
  const userData = post.User;

  const openPopover = Boolean(anchorElPopover);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  const postImage = checkPostImageUrlData(postData);
  const postDate = new Date(postData.Timestamp.toString()).toLocaleString('ru');
  const postUserAvatar = checkAvatarUrlData(userData);

  const commentsCount = post.Comments.length;
  const likesCount = post.Post_likes.length ? post.Post_likes.length : null;

  const isComments = commentsCount > 0;

  const isCurrentUserLike = postLikes.find((like) => like.Like_User.User_ID === store.user.User_ID);
  let isCurrentUser;

  if (store.user.role === 'admin') {
    isCurrentUser = true;
  } else {
    isCurrentUser = userData.User_ID === store.user.User_ID;
  }

  const handlePopoverOpen = (event) => {
    setAnchorElPopover(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorElPopover(null);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleEditClick = () => {
    setOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setOpenEditModal(false);
  };

  const handleAvatarClick = () => {
    navigate(`/users/${postData.User_ID}`);
  };

  const handleSendClick = () => {
    setOpenSendModal(true);
  };

  const handleSendModalClose = () => {
    setOpenSendModal(false);
  };

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuDelete = () => {
    handleCloseMenu();
    setPostDeleted(true);
    mutate(postData.Post_ID).then(() => reloadPosts());
    setOpenSnackbar(true);
  };

  return (
    <>
      <Box
        margin={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card sx={{ width: '80vh', maxWidth: 620 }}>
          <CardHeader
            avatar={(
              <Avatar
                src={postUserAvatar}
                sx={{ bgcolor: red[500] }}
                aria-label="username"
                onClick={handleAvatarClick}
              >
                U
              </Avatar>
                    )}
            action={(
              <div>
                {!isPostDeleted
                && (
                <div>
                  <IconButton aria-label="share" onClick={handleSendClick}>
                    <InsertLink />
                  </IconButton>
                  {isCurrentUser && (
                    <>
                      <IconButton aria-label="edit" onClick={handleEditClick}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="settings"
                        id="basic-button"
                        aria-controls={openMenu ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMenu ? 'true' : undefined}
                        onClick={handleClickMenu}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleCloseMenu}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                      >
                        <MenuItem onClick={handleMenuDelete}>Delete</MenuItem>
                      </Menu>
                    </>
                  )}
                </div>
                )}
              </div>
                    )}
            title={(
              <Typography>
                {userData.Username}
              </Typography>
        )}
            subheader={`${postDate} • ${postData.Visibility}`}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom component="div" color="text.primary">
              {postData.Title}
            </Typography>
            <Typography textAlign="justify" variant="body2" color="text.secondary">
              {postData.Text}
            </Typography>
            {postData.Image && (
              <Box
                paddingTop={3}
              >
                <CardMedia
                  component="img"
                  image={postImage}
                  onError={handleImageError}
                />
              </Box>
            )}
          </CardContent>
          {!isPostDeleted
              && (
              <div>
                <CardActions disableSpacing>
                  <IconButton
                    aria-label="add to favorites"
                  >
                    {!isCurrentUserLike && (
                    <FavoriteBorderIcon />
                    )}
                    {isCurrentUserLike && (
                    <FavoriteIcon sx={{ color: pink.A400 }} />
                    )}
                  </IconButton>

                  <Typography
                    aria-owns={openPopover ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    variant="subtitle2"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                  >
                    {likesCount < 1100 ? likesCount : `${(likesCount / 1000).toFixed(1)}k`}
                  </Typography>

                  {likesCount && (
                  <Popover
                    id="mouse-over-popover"
                    sx={{
                      pointerEvents: 'none',
                    }}
                    open={openPopover}
                    anchorEl={anchorElPopover}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                  >
                    <Box
                      sx={{
                        overflow: 'hidden',
                      }}
                      maxWidth={303}
                    >
                      <Grid
                        container
                      >
                        <AvatarGroup total={likesCount}>
                          {postLikes.map((like) => (
                            <Avatar
                              key={like.id}
                              sx={{ width: 35, height: 35 }}
                              src={`${config.apiURL}/users/${like.Like_User.User_ID}/avatar`}
                              alt={like.Username}
                            />
                          ))}
                        </AvatarGroup>
                      </Grid>
                    </Box>
                  </Popover>
                  )}
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    {isComments
                      ? (
                        <Typography>
                          Comments (
                          {commentsCount}
                          ):
                        </Typography>
                      ) : (
                        <Typography>
                          Add a comment
                        </Typography>
                      )}
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CommentsContainer
                    comments={post.Comments}
                    postId={post.Post_ID}
                    reloadPosts={reloadPosts}
                  />
                </Collapse>
              </div>
              )}
        </Card>
      </Box>
      <Modal open={openEditModal}>
        <Box sx={modalBoxStyle}>
          <Box sx={{
            position: 'absolute',
            left: '89%',
            top: '2%',
          }}
          >
            <IconButton onClick={handleEditModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <EditPostFormContainer
            id={postData.Post_ID}
            reloadPosts={reloadPosts}
            setOpen={setOpenEditModal}
          />
        </Box>
      </Modal>
      <Modal open={openSendModal}>
        <Box sx={modalBoxStyle}>
          <Box sx={{
            position: 'absolute',
            left: '89%',
            top: '2%',
          }}
          >
            <IconButton onClick={handleSendModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box marginTop={-3}>
            <h2>Share link:</h2>
            <TextField
              name="link"
              label="Copy this link:"
              value={`${config.clientURL}/posts/${postData.Post_ID}`}
              readOnly
              fullWidth
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Post;

Post.propTypes = postPropTypes;
