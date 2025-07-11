import React from 'react';

const MainPage = () => {
  return (
    <div className="mainpage-container" style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Left Sidebar */}
      <aside style={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.5rem' }}>LOGO</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#bbb', marginRight: '0.5rem' }}></div>
            <div>Name</div>
          </div>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Home</li>
              <li style={{ marginBottom: '0.5rem' }}>Notifications</li>
              <li style={{ marginBottom: '0.5rem' }}>Messages</li>
              <li style={{ marginBottom: '0.5rem' }}>Groups</li>
            </ul>
          </nav>
        </div>
        <button
          style={{ padding: '0.5rem', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          onClick={() => {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
        {/* Top Bar */}
        <header style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ flex: '0 0 100px', backgroundColor: '#ccc', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
            LOGO
          </div>
          <div style={{ flex: 1, margin: '0 1rem' }}>
            <input
              type="text"
              placeholder="Search"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '20px', border: '1px solid #aaa' }}
            />
          </div>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#ccc', borderRadius: '50%', cursor: 'pointer' }}>
            🔔
          </div>
        </header>

        {/* Post Input Section */}
        <section style={{ display: 'flex', marginBottom: '1rem' }}>
          <div style={{ flex: 1, marginRight: '1rem' }}>
            <label htmlFor="postInput" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Tell us what on your mind?
            </label>
            <textarea
              id="postInput"
              rows="5"
              style={{ width: '100%', borderRadius: '8px', border: '1px solid #aaa', padding: '0.5rem' }}
              placeholder="Post here"
            />
            <div style={{ marginTop: '0.5rem' }}>
              <button style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', border: '1px solid #aaa', cursor: 'pointer', marginRight: '0.5rem' }}>
                Add image +
              </button>
              <button style={{ padding: '0.3rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
                Post
              </button>
            </div>
          </div>
          <div style={{ width: '200px', backgroundColor: '#eee', borderRadius: '8px', padding: '1rem' }}>
            Preview post ?? maybe??
          </div>
        </section>

        {/* Posts Feed */}
        <section style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ backgroundColor: '#ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Post title</div>
            <div style={{ width: '100%', height: '150px', backgroundColor: '#bbb', borderRadius: '8px', marginBottom: '0.5rem' }}>
              Picture Preview in post if there is one
            </div>
            <div style={{ backgroundColor: '#ccc', borderRadius: '8px', padding: '0.5rem' }}>
              Commentary sections with user how commented* plus PFP picture / date
            </div>
          </div>
          {/* Additional posts can be added here */}
        </section>
      </main>
    </div>
  );
};

export default MainPage;
