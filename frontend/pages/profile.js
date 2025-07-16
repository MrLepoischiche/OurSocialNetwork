import React, { useState } from 'react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4].map((post) => (
              <div
                key={post}
                style={{
                  width: '150px',
                  height: '200px',
                  backgroundColor: '#bbb',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#333',
                  fontWeight: 'bold',
                }}
              >
                Post preview
              </div>
            ))}
          </div>
        );
      case 'liked':
        return <div>Liked posts content</div>;
      case 'tagged':
        return <div>Tagged posts content</div>;
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      {/* Top Bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#ddd',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
        }}
      >
        <div style={{ backgroundColor: '#aaa', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>
          Profile
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ width: '40px', height: '40px', backgroundColor: '#ccc', borderRadius: '50%', cursor: 'pointer' }}>
          🔔
        </div>
      </header>

      {/* Profile Info Section */}
      <section style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#bbb',
            marginRight: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#555',
          }}
        >
          PFP
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>Nickname/Username</h2>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#555' }}>
            <div>0 posts</div>
            <div>0 followers</div>
            <div>0 following</div>
          </div>
          <div
            style={{
              marginTop: '0.5rem',
              backgroundColor: '#ccc',
              borderRadius: '8px',
              padding: '0.5rem',
              maxWidth: '300px',
            }}
          >
            Bio/About ME here
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
          <button
            style={{
              padding: '0.3rem 1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#888',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Edit profile
          </button>
          <button
            style={{
              padding: '0.3rem 1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#888',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Share profile
          </button>
        </div>
        <div
          style={{
            marginLeft: '1rem',
            width: '30px',
            height: '30px',
            backgroundColor: '#888',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            fontWeight: 'bold',
          }}
          title="Settings"
        >
          ⚙️
        </div>
      </section>

      <hr />

      {/* Tabs */}
      <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
        {['posts', 'liked', 'tagged'].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px 20px 0 0',
              cursor: 'pointer',
              backgroundColor: activeTab === tab ? '#ccc' : 'transparent',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </nav>

      {/* Tab Content */}
      <section>{renderTabContent()}</section>
    </div>
  );
};

export default Profile;
