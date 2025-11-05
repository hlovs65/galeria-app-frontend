//src/components/Loading.jsx
import React from 'react';

const Loading = () => {
    return (
        <div className="loading-container" 
             style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100vh',
                fontSize: '1.5rem',
                color: '#555'
                }}>
            <p>Cargando...</p>
        </div>
    );
};

export default Loading;
