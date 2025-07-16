import React from 'react';
import Link from 'next/link';

const Messages = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#ddd',
          padding: '0.5rem 1rem',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Link href="/mainpage" passHref>
          <div style={{ backgroundColor: '#aaa', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            LOGO
          </div>
        </Link>
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

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Direct Messages List */}
        <aside
          style={{
            width: '250px',
            backgroundColor: '#eee',
            padding: '1rem',
            overflowY: 'auto',
            borderRight: '1px solid #ccc',
          }}
        >
          <h3>Direct Messages</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[1, 2, 3].map((user) => (
              <li
                key={user}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#bbb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#555',
                    marginRight: '0.5rem',
                    position: 'relative',
                  }}
                >
                  PFP
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: user === 3 ? 'black' : user === 2 ? 'green' : 'red',
                      border: '2px solid white',
                    }}
                  ></span>
                </div>
                <div>
                  <div>{`{Username}`}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>placeholder bio</div>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat Area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#bbb',
                marginRight: '1rem',
                position: 'relative',
              }}
            >
              PFP
              <span
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '6px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'green',
                  border: '2px solid white',
                }}
              ></span>
            </div>
            <h2>{`{Username}`}</h2>
          </div>
          <div style={{ height: '2px', backgroundColor: '#ccc', marginBottom: '1rem' }}></div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {/* Incoming message */}
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#bbb',
                  marginRight: '0.5rem',
                  position: 'relative',
                }}
              >
                PFP
                <span
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'green',
                    border: '2px solid white',
                  }}
                ></span>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{`{Username} 00:00AM/PM`}</div>
                <div>Placeholder Text</div>
                <div
                  style={{
                    width: '200px',
                    height: '100px',
                    backgroundColor: '#bbb',
                    borderRadius: '8px',
                    marginTop: '0.5rem',
                  }}
                >
                  Placeholder Image
                </div>
              </div>
            </div>

            {/* Outgoing message */}
            <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'flex-end' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{`{You} 00:00AM/PM`}</div>
                <div>Placeholder text</div>
              </div>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#bbb',
                  marginLeft: '0.5rem',
                  position: 'relative',
                }}
              >
                PFP
                <span
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'green',
                    border: '2px solid white',
                  }}
                ></span>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ccc',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              marginTop: '1rem',
            }}
          >
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginRight: '0.5rem',
              }}
              title="Add"
            >
              +
            </button>
            <input
              type="text"
              placeholder="Message {@Username}"
              style={{
                flex: 1,
                border: 'none',
                borderRadius: '20px',
                padding: '0.5rem 1rem',
                outline: 'none',
              }}
            />
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginLeft: '0.5rem',
              }}
              title="Emoji"
            >
              😊
            </button>
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginLeft: '0.5rem',
              }}
              title="Send"
            >
              📨
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
