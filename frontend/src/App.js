
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [channelData, setChannelData] = useState(null);
  const [channelName, setChannelName] = useState('');

  const fetchYouTubeData = async () => {
    if (!channelName) return;

    try {
      const response = await fetch(`http://localhost:5000/youtube/${channelName}`);
      const data = await response.json();
      console.log('Fetched Data:', data);
      setChannelData(data);
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
    }
  };

  const channelChartData = {
    labels: ['Subscribers', 'Views', 'Videos'],
    datasets: [
      {
        label: `${channelName} Channel Statistics`,
        data: [
          channelData?.channelStats?.subscriberCount || 0,
          channelData?.channelStats?.viewCount || 0,
          channelData?.channelStats?.videoCount || 0,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const videoLikesChartData = {
    labels: channelData?.videoStats?.map((video) => video.title) || [],
    datasets: [
      {
        label: 'Top 5 Video Likes',
        data: channelData?.videoStats?.map((video) => video.likeCount) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>YouTube Channel Statistics and Like Analysis</h1>
      <input
        type="text"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        placeholder="Enter YouTube Channel Name"
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button onClick={fetchYouTubeData} style={{ padding: '5px' }}>
        Fetch Data
      </button>

      {channelData && (
        <div style={{ marginTop: '20px' }}>
          <h2>Channel Statistics</h2>
          <div>
            <p><strong>Subscribers:</strong> {channelData.channelStats?.subscriberCount || 0}</p>
            <p><strong>Views:</strong> {channelData.channelStats?.viewCount || 0}</p>
            <p><strong>Videos:</strong> {channelData.channelStats?.videoCount || 0}</p>
          </div>

          <div style={{ width: '600px', height: '400px' }}>
            <Bar
              data={channelChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: 'top' },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(200, 200, 200, 0.3)' },
                  },
                  x: {
                    grid: { color: 'rgba(200, 200, 200, 0.3)' },
                  },
                },
              }}
            />
          </div>

          <h2 style={{ marginTop: '40px' }}>Top 5 Videos</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {channelData.videoStats?.map((video) => (
              <div key={video.videoId} style={{ margin: '10px', textAlign: 'center' }}>
                <img src={video.thumbnail} alt={video.title} style={{ width: '120px', height: '90px' }} />
                <p>{video.title}</p>
                <p><strong>Likes:</strong> {video.likeCount}</p>
              </div>
            ))}
          </div>

          <h2 style={{ marginTop: '40px' }}>Top 5 Video Likes</h2>
          <div style={{ width: '600px', height: '400px' }}>
            <Bar
              data={videoLikesChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, position: 'top' },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(200, 200, 200, 0.3)' },
                  },
                  x: {
                    grid: { color: 'rgba(200, 200, 200, 0.3)' },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
