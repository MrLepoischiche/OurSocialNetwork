import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/SocialNetwork.module.css'
import { FaHome, FaUser, FaUsers, FaBell, FaComments, FaLayerGroup, FaSignOutAlt } from 'react-icons/fa'

export default function HomePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('posts')
  const [user, setUser] = useState(null)
  const [profileUser, setProfileUser] = useState(null) // user whose profile is viewed
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      fetchUserData(token)
    }
  }, [])

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Unauthorized')
      }
      const data = await response.json()
      setUser(data)
      fetchProfileUser(data.id, token)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      router.push('/login')
    }
  }

  const fetchProfileUser = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch profile user')
      }
      const data = await response.json()
      setProfileUser(data)
      fetchFollowers(userId, token)
      fetchFollowing(userId, token)
      fetchUserPosts(userId, token)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchFollowers = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/followers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch followers')
      }
      const data = await response.json()
      setFollowers(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchFollowing = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/following`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch following')
      }
      const data = await response.json()
      setFollowing(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchUserPosts = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch user posts')
      }
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error(error)
    }
  }

  const togglePrivacy = async () => {
    if (!profileUser) return
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/api/users/${profileUser.id}/privacy`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPublic: !profileUser.isPublic })
      })
      if (!response.ok) {
        throw new Error('Failed to update privacy')
      }
      setProfileUser({ ...profileUser, isPublic: !profileUser.isPublic })
    } catch (error) {
      console.error(error)
    }
  }

  const handleProfileUpdate = async (updatedUser) => {
    const token = localStorage.getItem('token')
    try {
      const formData = new FormData()
      Object.keys(updatedUser).forEach(key => {
        if (key === 'avatar' && updatedUser[key]?.startsWith('data:')) {
          return
        }
        formData.append(key, updatedUser[key])
      })
      if (updatedUser.avatar && updatedUser.avatar.startsWith('data:')) {
        const response = await fetch(updatedUser.avatar)
        const blob = await response.blob()
        formData.append('avatar', blob, 'profile-picture.jpg')
      }
      const response = await fetch('http://localhost:8080/api/auth/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
      const updated = await response.json()
      setUser(updated)
      setProfileUser(updated)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    }
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return <ProfileTab 
          user={profileUser} 
          isOwnProfile={user && profileUser && user.id === profileUser.id} 
          togglePrivacy={togglePrivacy}
          onUpdate={handleProfileUpdate} 
        />
      case 'posts':
        return <PostsTab posts={posts} setPosts={setPosts} />
      case 'followers':
        return <FollowersTab followers={followers} />
      case 'groups':
        return <GroupsTab />
      case 'notifications':
        return <NotificationsTab />
      case 'chats':
        return <ChatsTab />
      default:
        return <PostsTab posts={posts} setPosts={setPosts} />
    }
  }

  return (
    <div className={styles.socialContainer}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={styles.mainContent}>
        <TopNav />
        {renderContent()}
      </div>
    </div>
  )
}

function TopNav() {
  return (
    <header className={styles.topNav}>
    </header>
  )
}

function ProfileTab({ user, isOwnProfile, togglePrivacy, onUpdate }) {
  if (!user) return <div>Loading...</div>
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    nickname: user.nickname,
    email: user.email,
    password: '',
    confirmPassword: '',
    aboutMe: user.aboutMe
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageClick = () => {
    if (isOwnProfile && isEditing) {
      fileInputRef.current.click();
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    const updatedUser = {
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      nickname: formData.nickname,
      email: formData.email,
      aboutMe: formData.aboutMe
    };
    if (formData.password) {
      updatedUser.password = formData.password;
    }
    if (previewImage) {
      updatedUser.avatar = previewImage;
    }
    onUpdate(updatedUser);
    setIsEditing(false);
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
    setPreviewImage(null);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname,
      email: user.email,
      password: '',
      confirmPassword: '',
      aboutMe: user.aboutMe
    });
  };
  
  return (
    <div>
      <div className={styles.profileHeader}>
        <img 
          src={previewImage || user.avatar || 'https://avatar.iran.liara.run/public/boy'} 
          alt="Profile" 
          className={styles.profileAvatar}
          onClick={handleImageClick}
          style={{ cursor: isOwnProfile && isEditing ? 'pointer' : 'default' }}
        />
        <div className={styles.profileInfo}>
          <h2>{user.firstName} {user.lastName}</h2>
          <p>@{user.nickname}</p>
          <p>{user.aboutMe}</p>
        </div>
      </div>
      {!isEditing ? (
        <div>
          {isOwnProfile && (
            <div style={{ marginBottom: '10px' }}>
              <button 
                onClick={() => setIsEditing(true)}
                style={{ marginRight: '10px', backgroundColor: '#1d9bf0', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer' }}
              >
                Edit Profile
              </button>
              <button 
                onClick={togglePrivacy}
                style={{ backgroundColor: '#e1e8ed', color: '#14171a', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer' }}
              >
                Make Profile {user.isPublic ? 'Private' : 'Public'}
              </button>
            </div>
          )}
          <p>Email: {user.email}</p>
          <p>Date of Birth: {user.dateOfBirth}</p>
          <p>Profile Type: {user.isPublic ? 'Public' : 'Private'}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label><br />
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label>Last Name</label><br />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div>
            <label>Username</label><br />
            <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label><br />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>New Password</label><br />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password" />
          </div>
          <div>
            <label>Confirm Password</label><br />
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Leave blank to keep current password" />
          </div>
          <div>
            <label>About Me</label><br />
            <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange} rows="3" />
          </div>
          <div style={{ marginTop: '10px' }}>
            <button type="submit" style={{ marginRight: '10px', backgroundColor: '#1d9bf0', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer' }}>Save Changes</button>
            <button type="button" onClick={cancelEdit} style={{ backgroundColor: '#e1e8ed', color: '#14171a', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer' }}>Cancel</button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
        </form>
      )}
    </div>
  )
}

function PostsTab({ posts, setPosts }) {
  const [postContent, setPostContent] = useState('')

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/posts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: postContent })
      })
      if (response.ok) {
        setPostContent('')
        fetchPosts()
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  return (
    <div className={styles.tabContent}>
      <form onSubmit={handleSubmit} className={styles.postForm}>
        <textarea 
          className={styles.postTextarea}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's happening?" 
        />
        <button type="submit" className={styles.postSubmit}>Tweet</button>
      </form>
      <div className={styles.postList}>
        {posts && posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className={styles.post}>
              <div className={styles.postHeader}>
                <img 
                  src={post.author?.avatar || 'https://avatar.iran.liara.run/public/boy'} 
                  alt={post.author ? `${post.author.firstName} ${post.author.lastName}` : 'User'} 
                />
                <div>
                  <h3>{post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown User'}</h3>
                  <p>{post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Unknown date'}</p>
                </div>
              </div>
              <p>{post.content}</p>
            </div>
          ))
        ) : (
          <p>No post to display. Under Maintenance... stay tuned</p>
        )}
      </div>
    </div>
  )
}

function FollowersTab({ followers }) {
  return (
    <div className={styles.tabContent}>
      <h2>Followers</h2>
      {followers && followers.length > 0 ? (
        <ul>
          {followers.map(follower => (
            <li key={follower.id}>
              <img 
                src={follower.avatar || 'https://avatar.iran.liara.run/public/boy'} 
                alt="Follower" 
                width={30} 
              />
              {follower.firstName} {follower.lastName} (@{follower.nickname})
            </li>
          ))}
        </ul>
      ) : (
        <p>No followers yet. Following function Currently not available ... </p>
      )}
    </div>
  )
}

function GroupsTab() {
  return (
    <div className={styles.tabContent}>
      <h2>Groups</h2>
      <p>No groups available.</p>
      <p> Groups are not Currently available ... </p>
    </div>
  )
}

function NotificationsTab() {
  return (
    <div className={styles.tabContent}>
      <h2>Notifications</h2>
      <p>No notifications at this time.</p>
      <p> Notification are under Maintenance... stay tuned</p>
    </div>
  )
}

function ChatsTab() {
  return (
    <div className={styles.tabContent}>
      <h2>Chats</h2>
      <p>No active chats.</p>
      <p> Under Construction... </p>
    </div>
  )
}

function Sidebar({ activeTab, setActiveTab }) {
  const router = useRouter();
  
  return (
    <aside className={styles.sidebar}>
      <button 
        className={activeTab === 'posts' ? `${styles.navButton} ${styles.active}` : styles.navButton}
        onClick={() => setActiveTab('posts')}
        aria-label="Home"
        title="Home"
      >
        <FaHome size={24} />
        <span className={styles.navButtonText}>Home</span>
      </button>
      <button 
        className={activeTab === 'profile' ? `${styles.navButton} ${styles.active}` : styles.navButton}
        onClick={() => setActiveTab('profile')}
        aria-label="Profile"
        title="Profile"
      >
        <FaUser size={24} />
        <span className={styles.navButtonText}>Profile</span>
      </button>
      <button 
        className={activeTab === 'followers' ? `${styles.navButton} ${styles.active}` : styles.navButton}
        onClick={() => setActiveTab('followers')}
        aria-label="Followers"
        title="Followers"
      >
        <FaUsers size={24} />
        <span className={styles.navButtonText}>Followers</span>
      </button>
      <button 
        className={activeTab === 'groups' ? `${styles.navButton} ${styles.active}` : styles.navButton}
        onClick={() => setActiveTab('groups')}
        aria-label="Groups"
        title="Groups"
      >
        <FaLayerGroup size={24} />
        <span className={styles.navButtonText}>Groups</span>
      </button>
      <button 
        className={activeTab === 'notifications' ? `${styles.navButton} ${styles.active}` : styles.navButton}
        onClick={() => setActiveTab('notifications')}
        aria-label="Notifications"
        title="Notifications"
      >
        <FaBell size={24} />
        <span className={styles.navButtonText}>Notifications</span>
      </button>
      <button 
        className={activeTab === 'chats' ? `${styles.navButton} ${styles.active}` : styles.navButton}
        onClick={() => setActiveTab('chats')}
        aria-label="Chats"
        title="Chats"
      >
        <FaComments size={24} />
        <span className={styles.navButtonText}>Chats</span>
      </button>
      <button 
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }}
        className={styles.navButton}
        aria-label="Logout"
        title="Logout"
      >
        <FaSignOutAlt size={24} />
        <span className={styles.navButtonText}>Logout</span>
      </button>
    </aside>
  );
}
